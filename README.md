# classes.jacobdanderson.net

Website and supporting API for `classes.jacobdanderson.net`.

## Repo Layout

- `front-end/` - Vite SSG application
- `back-end/` - Express + MongoDB API
- `HEALTHCHECKS.md` - monitor endpoints and expected `200`/`503` behavior

## Curriculum Paths

The diagram below shows the recommended progression through the current course
catalog and the most likely expansion branches. Plain labels are current
courses. Nodes marked `(planned)` are roadmap items from the course-planning
docs.

```mermaid
flowchart TD
    subgraph VisualPython["Visual, Python, and AI Path"]
        Scratch1["Scratch Level 1"] --> Scratch2["Scratch Level 2"]
        Scratch2 --> Python1["Python Level 1"]
        Python1 --> Python2["Python Level 2"]
        Python1 --> PyGames["PyGames"]
        Python2 --> Python3["Python Level 3"]
        Python3 --> MachineLearning["Machine Learning"]
        Python3 --> DataScience["Data Science in Python (planned)"]
        Python3 --> DesignPy["Pythonic Design Patterns (planned)"]
        DataScience --> MachineLearning
    end

    subgraph JavaPath["Java and Object-Oriented Design Path"]
        Java1["Java Level 1"] --> Java2["Java Level 2"]
        Java2 --> Java3["Java Level 3"]
        Java3 --> DesignJava["Design Patterns in Java (planned)"]
    end

    subgraph SystemsSecurity["Systems and Security Path"]
        Cpp1["C++ Level 1"] --> CSystems["C Systems Engineering (planned)"]
        Cpp1 --> LowLevelSecurity["Low Level Security"]
        CSystems --> LowLevelSecurity
        CSystems --> DesignCpp["Design Patterns in C++ (planned)"]
        CSystems --> Assembly["Assembly (planned)"]
        LowLevelSecurity --> LowLevelSecurity2["Low Level Security Part 2 (planned)"]
        Assembly --> LowLevelSecurity2
    end

    subgraph LinuxNetwork["Linux, Networking, and Ops Path"]
        LinuxSystems["Linux Systems (planned)"] --> NetworkSystems["Network Systems (planned)"]
        NetworkSystems --> NetworkSecurity["Network Security in TS/JS (planned)"]
    end

    subgraph WebPath["JavaScript, Web, and Deployment Path"]
        JS1["JavaScript Level 1"] --> JS2["JavaScript Level 2"]
        JS2 --> WebDevelopment["Web Development (planned)"]
        WebDevelopment --> FullStack["Full-Stack Web Apps (planned)"]
        WebDevelopment --> Deployment["Deployment and Cloud Hosting (planned)"]
        WebDevelopment --> NetworkSecurity
    end

    subgraph ScienceApps["Science and App Development Path"]
        Physics1["Intro to Physics"] --> Physics2["Physics Level 2"]
        SwiftIntro["Intro to Swift App Development"] --> SwiftExpanded["Swift App Development Expansion (planned)"]
    end
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
