# Swift App Development Expansion Plan

## Setup and Tooling

Preferred IDE: `Xcode`. JetBrains and VS Code can support Swift syntax, but for
real iOS app development, simulators, signing, and publishing, Xcode is the
required primary tool.

Official links:

- [Xcode support and downloads](https://developer.apple.com/support/xcode/)
- [Apple Developer Program enrollment](https://developer.apple.com/programs/enroll/)
- [App Store Connect build upload guide](https://developer.apple.com/help/app-store-connect/manage-builds/upload-builds)
- [VS Code download](https://code.visualstudio.com/Download)

macOS walkthrough:

1. Confirm the machine is running a macOS version supported by the target Xcode release.
2. Install Xcode from the App Store or Apple’s developer downloads page.
3. Open Xcode once so it can install extra components and simulators.
4. Sign in with an Apple ID in Xcode and explain when a paid Apple Developer account is required.
5. Create a starter SwiftUI app, run it on the simulator, and verify that signing, bundle identifiers, and scheme selection make sense before the real course begins.

Windows walkthrough:

1. Explain up front that native iOS app building and App Store publishing require macOS and Xcode.
2. If a student is on Windows, use VS Code only for reading Swift syntax or notes, not as the main development environment.
3. Plan to transition to a Mac before the practical build, simulator, signing, and publishing modules.
4. Keep Apple account setup, bundle IDs, TestFlight, and App Store Connect as conceptual modules until a Mac is available.
5. Avoid presenting Windows as a complete substitute, because it will create friction later in the course.

Course-specific notes:

- No CMake setup is needed.
- This course should begin with machine requirements, Apple account requirements, storage needs, and the publishing pipeline before code structure.

## Positioning

The current `Intro to Swift App Development` course is a good first taste of
SwiftUI, but it jumps into view code too quickly. The expanded version should
start with the Apple ecosystem itself: how app development on Apple platforms
works, what tools and accounts are required, how apps are built and signed, and
how publishing actually happens. Only after that systems-level orientation
should the course move into app structure, SwiftUI, and the Swift language.

## Main Goals

- Teach the Apple development pipeline, not just SwiftUI snippets
- Reduce confusion around setup, devices, signing, simulators, and publishing
- Make learners understand what an app is structurally before writing much code
- Teach Swift in the context of real app architecture
- Create a path from first app to TestFlight/App Store publishing

## Recommended New Course Shape

### Phase 1: Apple Platform and Publishing Foundations

#### Module 1: Apple Developer Ecosystem Overview

- What Xcode is
- What the Apple Developer Program is
- What App Store Connect is
- What TestFlight is
- The difference between building locally, testing, distributing, and publishing
- iPhone vs iPad vs Mac vs watchOS at a high level

#### Module 2: Mac Setup and Project Tooling

- macOS basics needed for development
- Installing Xcode
- Xcode components and simulators
- Storage requirements and updates
- Apple ID sign-in in Xcode
- How to create and organize app project folders

#### Module 3: Certificates, Signing, and Bundle IDs

- What code signing means
- Team selection in Xcode
- Bundle identifiers
- Development vs distribution signing at a conceptual level
- Why provisioning problems happen

#### Module 4: Running on Simulator and Device

- iOS Simulator basics
- Connecting a real iPhone
- Trusting the developer device path
- Common build and run issues
- Logging and crash messages

#### Module 5: App Store Connect and TestFlight Workflow

- App metadata
- screenshots
- icons
- version numbers and build numbers
- internal vs external testing
- review basics
- what happens after an upload

### Phase 2: App Structure Before Language Depth

#### Module 6: What an App Is Structurally

- entry point
- app lifecycle
- scenes
- views
- navigation
- assets
- data flow

#### Module 7: Xcode Project Anatomy

- project navigator
- targets
- schemes
- asset catalogs
- preview canvas
- plist/config files at a high level

#### Module 8: SwiftUI Mental Model

- declarative UI
- the body property
- view trees
- modifiers
- layout containers

### Phase 3: Swift Language Fundamentals in App Context

#### Module 9: Swift Basics

- constants and variables
- types
- strings
- arrays
- dictionaries
- optionals
- conditionals
- loops

#### Module 10: Functions, Structs, and Enums

- functions
- parameter labels
- structs as data and views
- enums for app state

#### Module 11: State and Data Flow

- `@State`
- `@Binding`
- `@StateObject`
- `@Observable` or modern observation model
- why state bugs happen

#### Module 12: Navigation and Multi-Screen Apps

- navigation stacks
- tabs
- sheets
- passing data between screens

### Phase 4: Building Real Apps

#### Module 13: Lists, Forms, and CRUD Patterns

- editable lists
- forms
- add/edit/delete workflows

#### Module 14: Media, Maps, and Device Features

- images
- icons
- maps
- camera and photos at a high level
- permissions

#### Module 15: Networking and Data Loading

- calling APIs
- decoding JSON
- loading states
- error states

#### Module 16: Persistence

- UserDefaults
- file storage
- simple local data persistence
- optional bridge into SwiftData/Core Data later

### Phase 5: Polish, Testing, and Publishing

#### Module 17: Debugging and Testing

- console logs
- breakpoints
- previews
- simple unit and UI test concepts

#### Module 18: App Design and Accessibility

- typography
- spacing
- touch targets
- dark mode
- accessibility labels

#### Module 19: Final Publishing Walkthrough

- archive build
- upload process
- App Store Connect checklists
- TestFlight release
- submission review basics

#### Module 20: Capstone App

- plan
- scope
- build
- test
- prepare store metadata
- optionally ship through TestFlight

## Recommended Project Sequence

- welcome/profile app
- media gallery app
- multi-tab hobby app
- map-based places app
- simple tracker app with persistence
- API-powered reference app
- capstone publish-ready app

## Delivery Notes

- The course should explicitly separate:
  - Apple ecosystem setup
  - app structure
  - Swift language mechanics
  - publishing workflow

- Students should leave knowing how to create, run, debug, and ship a basic app,
  not just how to type SwiftUI examples.

## Expansion Ideas

- Add UIKit comparison modules
- Add SwiftData or Core Data as a follow-up
- Add widgets, watchOS, or macOS as advanced electives
- Add monetization and in-app purchase overview
