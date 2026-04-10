# Rust Systems Security Course Plan

## Positioning

This course should exist as a next-step systems course for students who have
already completed a C or C++ path and are ready to study how modern systems
languages can preserve low-level control while improving security and
correctness.

The point is not to teach Rust as a fashionable replacement language in the
abstract. The point is to make students feel, in concrete engineering terms,
which classes of bugs Rust prevents or makes harder, and which tradeoffs still
remain.

Best fit in the current catalog:

- after `C++ Level 1`
- after `C Systems Engineering`
- after `Low Level Security`
- after `Data Structures and Algorithms in C++`

It can also serve as a strong follow-on option for students who are interested
in operating systems, embedded work, networking, compilers, or security
engineering.

## Core Goal

Teach Rust through direct comparison with the kinds of errors and maintenance
problems students already know from C and C++:

- use-after-free
- double free
- null or absent-value misuse
- unchecked indexing
- iterator invalidation
- aliasing and mutation hazards
- error handling by convention instead of by type
- data races in concurrent code

Every major Rust topic should answer a practical question:

`What would go wrong in C or C++ here, and how does Rust change that?`

## Recommendation

Preferred direction:

- build this as a standalone course, not just a short addendum
- keep the framing explicitly comparative with C and C++
- treat security and correctness as first-class course themes rather than as
  side notes

A small bridge lesson can be attached to existing C or C++ courses later, but
the full idea deserves its own course because ownership, borrowing, enums,
pattern matching, and the type-driven error model are too central to compress
into a small appendix.

## Entry Expectations

Students entering this course should already be able to:

- write nontrivial functions in C or C++
- use arrays, strings, structs or classes, and dynamic allocation
- read compiler errors and build simple CLI programs
- explain stack vs heap at a practical level
- understand pointers or references and why lifetime mistakes are dangerous
- describe at least a few real bug classes from low-level programming

Students do not need prior experience with advanced templates, metaprogramming,
or operating-system internals.

## Learning Outcomes

By the end of the course, students should be able to:

- explain Rust's ownership model in plain engineering language
- distinguish move, borrow, mutable borrow, and clone correctly
- use `Option` and `Result` instead of null-like or sentinel-value habits
- reason about slices, vectors, strings, and indexing safely
- use structs, enums, traits, and pattern matching to model state clearly
- build command-line tools with Cargo and the standard Rust workflow
- compare a C or C++ bug pattern with the Rust version and explain what changed
- identify when `unsafe` is required and why it narrows the trusted boundary
- describe which security problems Rust meaningfully reduces and which still
  depend on logic, protocol design, or API misuse

## Course Philosophy

This should not become a syntax-tour course.

The best version of the course repeatedly alternates between:

1. a familiar C or C++ problem shape
2. the bug or maintenance risk in that shape
3. the Rust version
4. the security or correctness improvement
5. the cost, friction, or design tradeoff

The course should be honest:

- Rust does not solve every security problem
- Rust does not remove the need for careful design
- Rust does impose new constraints and new vocabulary
- those constraints are often exactly why the resulting code is safer

## Delivery Shape

Recommended size:

- `12-16` modules
- roughly `14-20` sessions depending on project depth

Recommended pacing:

- the first third should focus on ownership, borrowing, and data modeling
- the middle should focus on collections, errors, and API design
- the last third should focus on systems-style tooling, FFI boundaries,
  concurrency, and a security-oriented capstone

## Suggested Repo Structure

Recommended future repo:

- `instruction-material/Rust-Systems-Security`

Recommended layout:

- one folder per major lab
- `starter/` and `solution/` in each project folder
- short `README.md` in each lab explaining:
    - the C or C++ bug pattern being contrasted
    - the Rust concept being introduced
    - the security lesson

Example layout:

- `RSS1-Ownership-and-Moves`
- `RSS2-Borrowing-and-Aliasing`
- `RSS3-Option-and-Result`
- `RSS4-Slices-Strings-and-Bounds`
- `RSS5-Structs-Enums-and-State-Machines`
- `RSS6-Traits-and-API-Contracts`
- `RSS7-Collections-and-Iterator-Safety`
- `RSS8-File-and-Input-Parsing`
- `RSS9-Concurrency-with-Threads-and-Channels`
- `RSS10-Unsafe-and-FFI-Boundaries`
- `RSS11-Secure-CLI-Audit-Tool`
- `RSS12-Capstone-Harden-a-Legacy-Tool`

## Full Module Plan

### RSS0: Tooling, Cargo, and Why Rust Exists

- install Rust with `rustup`
- verify `cargo`, `rustc`, `clippy`, and `rustfmt`
- compare the Rust workflow with CMake, `clang`, and `g++`
- set course expectations around safety, compiler guidance, and zero-cost
  abstractions
- show a short motivating comparison: a tiny C memory bug beside a Rust program
  the compiler rejects

### RSS1: Ownership, Moves, and Single Responsibility for Memory

- teach ownership as "one clear owner at a time" rather than as mystical
  compiler law
- compare ownership transfer to common C/C++ lifetime confusion
- introduce moves, copies for simple types, and the meaning of `Clone`
- use tiny examples that replace double free and dangling-owner patterns with
  compile-time feedback

### RSS2: Borrowing, References, and Aliasing Control

- teach shared borrows and mutable borrows
- show why Rust restricts simultaneous mutation and observation
- compare this directly to aliasing bugs and invalidated assumptions in C/C++
- emphasize the security value of limiting ambiguous write access

### RSS3: Lifetimes Without Making Them Mystical

- introduce lifetime reasoning through concrete scope relationships first
- show that many lifetimes can be inferred
- use explicit lifetime annotations only after students understand the problem
  they solve
- compare lifetime annotations to the invisible lifetime assumptions students
  used to make in C and C++

### RSS4: `Option`, `Result`, and Type-Driven Error Handling

- replace null-like habits with `Option`
- replace sentinel returns and unchecked error codes with `Result`
- use pattern matching and `?`
- compare this with C APIs that depend on disciplined convention rather than on
  the type system
- emphasize how this reduces forgotten checks and ambiguous failure states

### RSS5: Strings, Slices, Vectors, and Bounds Safety

- distinguish `String`, `&str`, arrays, slices, and `Vec<T>`
- teach why UTF-8 and indexing rules matter
- compare safe slicing and bounds-checked access against classic out-of-bounds
  errors in C or manual indexing hazards in C++
- connect the lesson to memory safety and parser correctness

### RSS6: Structs, Enums, and Safer State Modeling

- use structs and enums to model application state explicitly
- compare tagged enums and pattern matching against ad hoc integer state codes,
  booleans, or nullable fields
- show how better state modeling prevents impossible or half-initialized states

### RSS7: Traits, Generics, and Interface Discipline

- teach traits as a disciplined way to express shared behavior
- compare traits with virtual methods, abstract classes, and template-heavy
  designs only as needed
- focus on API contracts and composability, not on advanced type-system stunts
- show how strong interfaces reduce misuse and make security-sensitive code
  easier to reason about

### RSS8: Collections, Iterators, and Invalidation-Safe Patterns

- compare `Vec`, `HashMap`, iterators, and ownership-aware loops with raw loops
  and mutation-heavy patterns in C++
- teach iterator adapters where they genuinely improve clarity
- highlight invalidation and mutation pitfalls Rust prevents or surfaces

### RSS9: Parsing Input and Building Robust CLIs

- build a small parser-oriented CLI
- emphasize typed parsing, validated input, and explicit error paths
- compare with fragile string splitting and unchecked assumptions in legacy C
  utilities
- introduce useful crates only when they support the lesson cleanly

### RSS10: Concurrency Without Data Races by Default

- introduce threads, `Send`, `Sync`, `Arc`, `Mutex`, and channels
- compare Rust's model to the data-race hazards students may have seen in C++
- emphasize what the compiler prevents and what deadlocks or logic bugs still
  require discipline to avoid
- make this a security and correctness module, not only a performance module

### RSS11: `unsafe`, FFI, and Trusted Boundaries

- explicitly teach that Rust safety is not magic and that `unsafe` narrows the
  zone where manual proof is required
- show safe wrappers around small unsafe blocks
- introduce FFI to C carefully
- compare this to writing all code in an always-trusted memory-unsafe context
- frame `unsafe` review as a security boundary and auditing task

### RSS12: Security Claims Rust Can and Cannot Make

- summarize which issues Rust strongly reduces:
    - many memory-safety bugs
    - some classes of race-condition bugs
    - some unchecked absent-value patterns
- summarize what Rust does not automatically solve:
    - bad cryptography choices
    - command injection
    - insecure protocols
    - authorization mistakes
    - logic flaws
- teach students to make precise claims rather than saying "Rust is secure"

### RSS13: Capstone Preparation and Legacy Comparison

- prepare students to audit or port a small legacy C/C++ utility
- identify memory-risk hotspots, unchecked parsing, ownership ambiguity, and
  brittle error handling
- choose a bounded scope that is realistic for a course capstone

### RSS14: Capstone: Harden a Legacy Tool

- students either:
    - port a small unsafe utility from C/C++ into Rust
    - or rebuild its core logic in Rust while preserving the public behavior
- require a written comparison:
    - what bug classes were present before
    - what Rust changed
    - what risks still remain
    - where `unsafe` or external assumptions still exist

## Suggested Projects

The projects should feel like systems tools, not toy syntax drills.

Recommended project arc:

- `RSS1`: ownership lab with deliberate move/borrow errors
- `RSS2`: aliasing-safe text buffer or record editor
- `RSS3`: config loader using `Option` and `Result`
- `RSS4`: safe slice and parser exercises
- `RSS5`: enum-driven finite-state parser or protocol decoder
- `RSS6`: trait-based log sink or serializer interface
- `RSS7`: collection-backed inventory or event tracker
- `RSS8`: robust file and argument parser
- `RSS9`: threaded worker or message-passing simulation
- `RSS10`: tiny safe wrapper around one `unsafe` or FFI task
- `RSS11`: secure audit CLI that checks logs, files, or toy configs
- `RSS12`: capstone migration or hardening project

## Security Comparison Pattern

Each major lab should include a short comparison block:

- `C/C++ risk`
- `Rust design choice`
- `what the compiler prevents`
- `what the programmer still must do correctly`

That comparison pattern is central to the course identity and should appear in
the lab READMEs, not only in live teaching notes.

## Relationship to Existing Courses

This course should not replace the current C and C++ sequence. It should depend
on it.

Recommended catalog phrasing:

- `C++ Level 1` teaches typed compiled programming and class-based structure
- `C Systems Engineering` teaches bytes, layout, memory, and systems debugging
- `Low Level Security` shows how low-level bugs become security problems
- `Rust Systems Security` shows one modern way to keep systems-level power while
  reducing major classes of those bugs

That positioning makes the Rust course feel like a meaningful advancement
rather than a disconnected language switch.

## Instructor Notes

- avoid overloading early lessons with advanced trait syntax or lifetime-heavy
  edge cases
- keep comparisons concrete and fair rather than ideological
- resist spending too much time on ecosystem trivia
- prefer small, inspectable tools over giant async web projects
- use `clippy` and compiler diagnostics as teaching tools, not as scolding

## Success Criteria

This plan is successful when a student can say something stronger than
"Rust feels safer."

They should be able to say:

- which bug class is reduced
- how the Rust design enforces that reduction
- what tradeoff they paid
- and what risks still remain outside the language's guarantees

That is the real educational value of the course.
