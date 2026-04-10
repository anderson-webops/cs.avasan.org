# classes.jacobdanderson.net

Website and supporting API for `classes.jacobdanderson.net`.

## Repo Layout

- `front-end/` - Vite SSG application
- `back-end/` - Express + MongoDB API
- `HEALTHCHECKS.md` - monitor endpoints and expected `200`/`503` behavior

## Curriculum Paths

The diagram below reads from top to bottom. The top row shows possible entry
points into the catalog, and dashed arrows show optional bridge or transition
paths. Plain labels are current courses. Nodes marked `(planned)` are roadmap
items from the course-planning docs rather than live standalone catalog
entries.

```mermaid
flowchart TB
    classDef planned fill:#fff7d6,stroke:#b58900,color:#5b4500,stroke-width:1px;

    subgraph Entry["Possible Entry Points"]
        direction LR
        Scratch1["Scratch Level 1"]
        Python1["Python Level 1"]
        Java1["Java Level 1"]
        Cpp1["C++ Level 1"]
        JS1["JavaScript Level 1"]
        LinuxSystems["Linux Systems"]
        Physics1["Intro to Physics"]
        Chemistry["Intro to Chemistry"]
        SwiftIntro["Intro to Swift App Development"]
        AI1["AI Level 1"]
        APCSA["AP Computer Science A"]
    end

    Scratch1 --> Scratch2["Scratch Level 2"]
    Scratch2 --> Python1
    Python1 --> Python2["Python Level 2"]
    Python1 --> PyGames["PyGames"]
    Python2 --> Python3["Python Level 3"]
    Python3 --> DataScience["Data Science in Python"]
    DataScience --> MachineLearning["Machine Learning"]
    Python3 --> DesignPy["Pythonic Design Patterns"]
    AI1 --> MachineLearning

    PythonBridge["Python to Java and C++ Bridge (planned addendum)"]
    Python2 -.-> PythonBridge
    Python3 -.-> PythonBridge
    PythonBridge -.-> Java1
    PythonBridge -.-> Cpp1

    Java1 --> Java2["Java Level 2"]
    Java2 --> Java3["Java Level 3"]
    Java3 --> DesignJava1["Design Patterns in Java"]
    DesignJava1 --> DesignJava2["Design Patterns in Java Part 2: Refactoring"]

    Cpp1 --> CSystems["C Systems Engineering"]
    Cpp1 --> DsaCpp["Data Structures and Algorithms in C++"]
    Cpp1 --> LowLevelSecurity["Low Level Security"]
    CSystems --> DesignCpp["Design Patterns in C++"]
    CSystems --> Assembly["Assembly"]
    CSystems --> LowLevelSecurity
    LowLevelSecurity --> LowLevelSecurity2["Low Level Security Part 2"]
    Assembly --> LowLevelSecurity2
    DsaCpp --> USACOBronze["USACO Bronze"]
    USACOBronze --> USACOSilver["USACO Silver"]
    USACOSilver --> USACOGold["USACO Gold"]

    JS1 --> JS2["JavaScript Level 2"]
    JS2 --> WebDevelopment["Web Development Foundations"]
    WebDevelopment --> NetworkSecurity["Network Security"]
    LinuxSystems --> NetworkSystems["Network Systems"]
    NetworkSystems --> NetworkSecurity

    Physics1 --> Physics2["Physics Level 2"]

    class PythonBridge planned;
```

## Common Commands

```bash
npm install
npm run dev
npm run server
npm run serve
npm run build
npm run up
```

## Operational Notes

- The root `package-lock.json` is the authoritative lockfile for the repo. Keep it updated whenever dependencies change.
- Use `npm run server` and `npm run serve` when you want the API and front-end started separately.
- Use [`HEALTHCHECKS.md`](./HEALTHCHECKS.md) for deployment monitor targets instead of `/`.
