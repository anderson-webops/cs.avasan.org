import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const introToSwiftAppDevelopmentCourse: RawCourse = {
	name: "Intro to Swift App Development",
	modules: [
		{
			title: "SAD1 Apple Developer Ecosystem Overview",
			curriculum: [
				{
					title: "The Apple Development Pipeline",
					content:
						"Start the course with the ecosystem itself, not with random SwiftUI snippets. Define what Xcode, the Apple Developer Program, App Store Connect, and TestFlight each do, and explain the difference between building locally, testing internally, distributing to testers, and publishing publicly. Make the pipeline visible early so later setup and publishing steps feel connected."
				},
				{
					title: "Apple Platforms at a High Level",
					content:
						"Compare iPhone, iPad, Mac, and watchOS at a high level and explain why this course focuses first on iPhone-style SwiftUI apps. Use this module to set scope expectations: students are learning a practical path to a first shipped app, not every Apple platform all at once."
				},
				{
					title: "Practical Walkthrough: Local Build vs TestFlight vs App Store",
					content:
						"Walk through a concrete release ladder: run in Xcode, test on simulator, test on device, archive, upload, distribute through TestFlight, and finally prepare for App Review. Skill target: Explain what changes at each step, especially around signing, metadata, and who can access the build."
				},
				{
					title: "Reflection Question: Where Does Publishing Friction Come From?",
					content:
						"Explain which parts of the Apple app pipeline are technical, which are organizational, and which are account-related. The goal is to reduce confusion later by making invisible dependencies explicit now."
				},
				{
					title: "SAD1 Apple Developer Ecosystem Overview: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD1 Apple Developer Ecosystem Overview",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/legacy"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: accurately describe the role of Xcode, TestFlight, App Store Connect, and the Apple Developer Program without blending them together. Prompt: 'What can you do with a local simulator build that you cannot do with an App Store listing?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/legacy"
				},
				{
					title: "Mod5Pro3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD1 Apple Developer Ecosystem Overview",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro3"
				},
				{
					title: "Apple Developer Ecosystem Overview supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD1 Apple Developer Ecosystem Overview",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-01-sad1-apple-developer-ecosystem-overview-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-01-sad1-apple-developer-ecosystem-overview-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD2 Mac Setup and Project Tooling",
			curriculum: [
				{
					title: "Machine Requirements and Platform Reality",
					content:
						"Explain clearly that real iOS building, simulator use, signing, archiving, and App Store publishing require macOS and Xcode. Windows can support note-taking or light Swift syntax exploration, but it is not a complete replacement for the practical parts of the course. Set expectations early so students do not build a workflow that collapses later."
				},
				{
					title: "Practical Walkthrough: Installing Xcode and Simulators",
					content:
						"Confirm macOS compatibility, install Xcode, open it once for first-run components, and review storage expectations for simulator downloads and updates. Explain why Xcode updates can affect simulator availability, build settings, and course pacing."
				},
				{
					title: "Practical Walkthrough: Apple ID Sign-In and Folder Organization",
					content:
						"Sign in with an Apple ID in Xcode and explain when a paid Apple Developer membership is required. Create a clean app-development folder structure for projects, screenshots, app icons, metadata drafts, and notes so students start with manageable organization."
				},
				{
					title: "Mini Lab: First Blank SwiftUI App",
					content:
						"Create a new iOS App project in Xcode, run it in the preview canvas and simulator, and confirm that scheme selection, destination choice, and project naming make sense. This lab is about environmental confidence, not visual polish."
				},
				{
					title: "SAD2 Mac Setup and Project Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain why a Mac is required for practical iOS shipping work and create a new project without getting lost in Xcode's initial templates. Prompt: identify where screenshots, exported builds, and app notes should live before real app work begins.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro1"
				},
				{
					title: "Mac Setup and Project Tooling supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-02-sad2-mac-setup-and-project-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-02-sad2-mac-setup-and-project-tooling-supplemental-2/solution"
				},
				{
					title: "Mac Setup and Project Tooling supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD2 Mac Setup and Project Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-03-sad2-mac-setup-and-project-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-03-sad2-mac-setup-and-project-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD3 Certificates, Signing, and Bundle IDs",
			curriculum: [
				{
					title: "What Code Signing Actually Means",
					content:
						"Introduce code signing as proof of authorship and permission rather than as a mysterious Xcode checkbox. Explain teams, bundle identifiers, development signing, and distribution signing conceptually before students hit the errors in practice."
				},
				{
					title: "Practical Walkthrough: Team Selection and Bundle IDs",
					content:
						"Show where team selection lives in Xcode and how a bundle identifier uniquely names an app. Connect bundle IDs to device builds, archived uploads, and App Store records so naming decisions have an explicit practical purpose."
				},
				{
					title: "Troubleshooting Lab: Why Provisioning Problems Happen",
					content:
						"Review common signing failures such as mismatched bundle IDs, missing capabilities, or the wrong team/account context. The important habit is reading the error message, identifying which layer failed, and fixing the configuration instead of clicking random settings."
				},
				{
					title: "Reflection Question: Which Part of Signing Is Conceptual vs Configurational?",
					content:
						"Separate the big idea of trusted app identity from the specific Xcode settings that implement it. This makes later troubleshooting much calmer and more systematic."
				},
				{
					title: "SAD3 Certificates, Signing, and Bundle IDs: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD3 Certificates, Signing, and Bundle IDs",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: define a bundle identifier, explain what 'team' means in Xcode, and say why a locally runnable build still depends on signing context. Prompt: 'Why can two apps not share the same production bundle identifier?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro2"
				},
				{
					title: "Certificates, Signing, and Bundle IDs supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD3 Certificates, Signing, and Bundle IDs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-04-sad3-certificates-signing-and-bundle-ids-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-04-sad3-certificates-signing-and-bundle-ids-supplemental-2/solution"
				},
				{
					title: "Certificates, Signing, and Bundle IDs supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD3 Certificates, Signing, and Bundle IDs",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-05-sad3-certificates-signing-and-bundle-ids-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-05-sad3-certificates-signing-and-bundle-ids-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD4 Running on Simulator and Device",
			curriculum: [
				{
					title: "Simulator vs Real Device",
					content:
						"Explain the strengths and limits of the iOS Simulator and why certain checks still need a real iPhone. Use this module to compare rapid UI iteration, hardware features, permissions, and performance realism."
				},
				{
					title: "Practical Walkthrough: Build and Run Destinations",
					content:
						"Show how to choose simulator destinations, connect a real device, trust the developer path, and verify that the correct scheme is selected. Learn the difference between an app that compiles, an app that launches, and an app that behaves correctly."
				},
				{
					title: "Practical Walkthrough: Logs, Console Output, and Crash Clues",
					content:
						"Introduce console logs, build output, and the kinds of messages that matter during the first run-on-device workflow. The goal is to capture the first useful failure signal rather than chasing symptoms."
				},
				{
					title: "Mini Lab: First Launch Troubleshooting",
					content:
						"Take a blank or simple starter app, run it on simulator, then on device if available, and document what changed between the two paths. Record one issue they encountered or might realistically encounter and how they would investigate it."
				},
				{
					title: "SAD4 Running on Simulator and Device: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro3"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: switch destinations intentionally, recognize the difference between simulator-only confidence and real-device confidence, and find the basic logging surfaces in Xcode. Prompt: identify what to inspect first if a build compiles but never launches on a phone.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod1Pro3"
				},
				{
					title: "Running on Simulator and Device supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-06-sad4-running-on-simulator-and-device-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-06-sad4-running-on-simulator-and-device-supplemental-2/solution"
				},
				{
					title: "Running on Simulator and Device supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD4 Running on Simulator and Device",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-07-sad4-running-on-simulator-and-device-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-07-sad4-running-on-simulator-and-device-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD5 App Store Connect and TestFlight Workflow",
			curriculum: [
				{
					title: "Metadata, Builds, and Reviewer Context",
					content:
						"Introduce App Store Connect as the operational side of app distribution: metadata, screenshots, versions, build numbers, testers, review notes, and release control. Make clear that publishing is partly a product-communication task, not only a code task."
				},
				{
					title: "Practical Walkthrough: Internal vs External Testing",
					content:
						"Explain the difference between internal and external TestFlight groups, what information each workflow requires, and why beta notes and review context matter. Key idea: Where testing sits between private development and public release."
				},
				{
					title: "Practical Walkthrough: Version Numbers, Build Numbers, and Assets",
					content:
						"Review screenshots, app icons, version numbers, build numbers, descriptions, and support information. Connect each item to the learner-facing reality of uploading a build later in the course."
				},
				{
					title: "Reflection Question: What Makes an App Feel Release-Ready?",
					content:
						"Explain why a stable build can still be unready for testing or review if the metadata and presentation are weak. They should identify at least one non-code requirement that affects the shipping pipeline."
				},
				{
					title: "SAD5 App Store Connect and TestFlight Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD5 App Store Connect and TestFlight Workflow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish a build number from a version number and explain why screenshots and descriptions are part of the release process. Prompt: 'What can stop a release even if the code itself is fine?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro1"
				},
				{
					title: "App Store Connect and TestFlight Workflow supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD5 App Store Connect and TestFlight Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-08-sad5-app-store-connect-and-testflight-workflow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-08-sad5-app-store-connect-and-testflight-workflow-supplemental-2/solution"
				},
				{
					title: "App Store Connect and TestFlight Workflow supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SAD5 App Store Connect and TestFlight Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-09-sad5-app-store-connect-and-testflight-workflow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-09-sad5-app-store-connect-and-testflight-workflow-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD6 What an App Is Structurally",
			curriculum: [
				{
					title: "Entry Point, Lifecycle, Scenes, and Views",
					content:
						"Explain what an app is structurally before diving deeper into Swift syntax. Cover the app entry point, scenes, views, navigation, assets, and data flow so students can place each later topic inside a coherent architecture."
				},
				{
					title: "Navigation, Assets, and Data as App Systems",
					content:
						"Compare what belongs in view code, what belongs in assets, and what belongs in the app's data model. Treat navigation and data flow as structural systems rather than decorative extras."
				},
				{
					title: "Worked Example Set: Reading a Tiny App Blueprint",
					content:
						"Take a small app and identify where the app launches, which views it owns, how navigation branches, and where user-facing data is stored or derived. This should feel like architecture reading, not just code reading."
				},
				{
					title: "Reflection Question: Which Part of an App Should Change Most Slowly?",
					content:
						"Compare core structure with surface-level UI and explain which decisions should stay stable and which should be easy to revise. The goal is to start building architectural judgment."
				},
				{
					title: "SAD6 What an App Is Structurally: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: label the app entry point, scene, view hierarchy, navigation model, and data model responsibilities in a small example. The structure should be explainable without relying on memorized code fragments.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod2Pro2"
				},
				{
					title: "What an App Is Structurally supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-10-sad6-what-an-app-is-structurally-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-10-sad6-what-an-app-is-structurally-supplemental-2/solution"
				},
				{
					title: "What an App Is Structurally supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD6 What an App Is Structurally",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-11-sad6-what-an-app-is-structurally-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-11-sad6-what-an-app-is-structurally-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD7 Xcode Project Anatomy",
			curriculum: [
				{
					title: "Navigating an Xcode Project",
					content:
						"Review the project navigator, targets, schemes, asset catalogs, preview canvas, and configuration files at a practical level. The purpose is not memorizing every panel but knowing where common app-development work actually lives."
				},
				{
					title: "Practical Walkthrough: Templates, Targets, and Schemes",
					content:
						"Create a new project and explain the role of the selected template, target, and scheme. Connect scheme choice to build destinations and target settings to bundle identity and app capabilities."
				},
				{
					title: "Practical Walkthrough: Asset Catalogs and Preview Canvas",
					content:
						"Show how images, icons, and colors are added, and how the preview canvas supports fast SwiftUI iteration. Key idea: Why assets belong in dedicated containers instead of scattered file imports."
				},
				{
					title: "Reflection Question: Which Xcode Areas Do You Need Every Day?",
					content:
						"Identify which Xcode panes matter for everyday app work and which ones are more occasional configuration tools. This helps reduce cognitive overload when the interface feels large."
				},
				{
					title: "SAD7 Xcode Project Anatomy: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: locate the file navigator, target settings, assets, and previews fast enough to support normal app iteration. A helpful checkpoint identifies where to change the bundle ID or add a new image.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro1"
				},
				{
					title: "Xcode Project Anatomy supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-12-sad7-xcode-project-anatomy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-12-sad7-xcode-project-anatomy-supplemental-2/solution"
				},
				{
					title: "Xcode Project Anatomy supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD7 Xcode Project Anatomy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-13-sad7-xcode-project-anatomy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-13-sad7-xcode-project-anatomy-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD8 SwiftUI Mental Model",
			curriculum: [
				{
					title: "Declarative UI and View Trees",
					content:
						"Introduce SwiftUI as a declarative system where views describe UI state rather than imperatively drawing one widget at a time. Explain `body`, view trees, modifiers, and layout containers so students understand what SwiftUI is trying to optimize for."
				},
				{
					title: "Worked Example Set: Text, Stacks, and Modifiers",
					content:
						"Build up a small screen from `Text`, `VStack`, `HStack`, overlays, spacing, and background shapes. Show how small changes in modifier order affect layout and styling, because this is one of the earliest conceptual friction points in SwiftUI."
				},
				{
					title: "Project: Welcome Profile App",
					content:
						"Build a welcome/profile app that turns a simple static screen into a real SwiftUI starter project. Use this as the first applied project for reading a view tree, customizing hierarchy, and practicing navigation between a landing screen and a detail screen.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/solution"
				},
				{
					title: "Reflection Question: Why Does Modifier Order Matter?",
					content:
						"Explain one example where changing modifier order changes the result. They should focus on layout or styling consequences, not just say that SwiftUI is 'sensitive.'."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain SwiftUI as a declarative system and identify the major branches of a small view tree without help. Prompt: describe what happens first when a `Text` view also has padding, background, and corner radius modifiers.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD1-Welcome-Profile-App/solution"
				},
				{
					title: "SwiftUI Mental Model supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD8 SwiftUI Mental Model",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-14-sad8-swiftui-mental-model-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-14-sad8-swiftui-mental-model-supplemental-2/solution"
				},
				{
					title: "SwiftUI Mental Model supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD8 SwiftUI Mental Model",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-15-sad8-swiftui-mental-model-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-15-sad8-swiftui-mental-model-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD9 Swift Basics in App Context",
			curriculum: [
				{
					title: "Variables, Constants, and Types",
					content:
						"This section covers Swift language basics in the context of app code rather than as abstract textbook material. Cover `let`, `var`, common types, strings, arrays, dictionaries, optionals, conditionals, and loops using examples that feed directly into UI and app data."
				},
				{
					title: "Worked Example Set: Modeling App Content with Basic Types",
					content:
						"Create arrays of menu items, dictionaries of quick settings, and optional values for missing profile data. Use these examples to show why app development repeatedly returns to the same small set of language tools."
				},
				{
					title: "Practice Lab: Turning Raw Data into View Content",
					content:
						"Take a few small pieces of app content and transform them into values a SwiftUI view can render cleanly. Practice target: Conditional display, simple loops, and safe handling of missing data."
				},
				{
					title: "Reflection Question: Which Swift Basics Show Up Most Often in Apps?",
					content:
						"Identify which language features feel most central to day-to-day app code so far and why. This keeps the language connected to real usage instead of isolated drills."
				},
				{
					title: "SAD9 Swift Basics in App Context: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD9 Swift Basics in App Context",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: model a small piece of app data using the right combination of constants, arrays, optionals, and conditionals. Prompt: represent an optional profile subtitle that may or may not exist.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod3Pro2"
				},
				{
					title: "Swift Basics in App Context supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD9 Swift Basics in App Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-16-sad9-swift-basics-in-app-context-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-16-sad9-swift-basics-in-app-context-supplemental-2/solution"
				},
				{
					title: "Swift Basics in App Context supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD9 Swift Basics in App Context",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-17-sad9-swift-basics-in-app-context-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-17-sad9-swift-basics-in-app-context-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD10 Functions, Structs, and Enums",
			curriculum: [
				{
					title: "Functions and Parameter Labels",
					content:
						"Introduce functions as named units of behavior and explain why Swift parameter labels improve call-site clarity. Use app-flavored examples such as formatting labels, choosing icons, or deriving status messages."
				},
				{
					title: "Structs as App Data and Views",
					content:
						"Show how structs can represent both model data and SwiftUI views, and explain why that dual role is so common in SwiftUI architecture. Connect this directly to reusable components and structured data instead of repeating hard-coded view snippets."
				},
				{
					title: "Enums for App State",
					content:
						"Introduce enums as a way to represent a closed set of app states or routes, such as loading, loaded, and failed or a set of tab destinations. Use them to teach stronger thinking about state than scattered booleans alone."
				},
				{
					title: "Reflection Question: Why Are Structs So Important in SwiftUI?",
					content:
						"Compare a struct as a piece of app data with a struct as a reusable view and explain what both uses share. The goal is architectural intuition, not memorized terminology."
				},
				{
					title: "SAD10 Functions, Structs, and Enums: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD10 Functions, Structs, and Enums",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: write a small helper function with clear labels, define a struct for app data, and name an enum that captures a real UI state cleanly. Prompt: 'What would an enum express better than three related booleans?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro1"
				},
				{
					title: "Functions, Structs, and Enums supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD10 Functions, Structs, and Enums",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-18-sad10-functions-structs-and-enums-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-18-sad10-functions-structs-and-enums-supplemental-2/solution"
				},
				{
					title: "Functions, Structs, and Enums supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD10 Functions, Structs, and Enums",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-19-sad10-functions-structs-and-enums-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-19-sad10-functions-structs-and-enums-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD11 State and Data Flow",
			curriculum: [
				{
					title: "`@State`, `@Binding`, and Observable Data",
					content:
						"This section covers `@State`, `@Binding`, `@StateObject`, and the broader observation model as answers to the question: who owns this data and who is allowed to change it? Focus on ownership first so the wrappers feel motivated instead of magical."
				},
				{
					title: "Worked Example Set: Local State vs Shared State",
					content:
						"Compare local toggle state, editable form state, and a small shared store so each pattern has a clear ownership boundary. Use examples that show how state bugs happen when ownership is vague or duplicated."
				},
				{
					title: "Practice Lab: Favorite Toggle and Editable Notes",
					content:
						"Build one small interaction that is purely local and one that should be shared across multiple views. Explain why the two interactions do not deserve the same state approach."
				},
				{
					title: "Reflection Question: What Does It Mean to Own State?",
					content:
						"Define state ownership in plain language and connect it to the app bugs they are most likely to create at this stage. Clear reasoning here pays off heavily in later CRUD and networking modules."
				},
				{
					title: "SAD11 State and Data Flow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: point to the single owner of a value and explain why a child view might need a binding rather than its own duplicate state. Prompt: predict what happens if two views each keep their own unsynchronized copy of the same setting.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro2"
				},
				{
					title: "State and Data Flow supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-20-sad11-state-and-data-flow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-20-sad11-state-and-data-flow-supplemental-2/solution"
				},
				{
					title: "State and Data Flow supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD11 State and Data Flow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-21-sad11-state-and-data-flow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-21-sad11-state-and-data-flow-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD12 Navigation and Multi-Screen Apps",
			curriculum: [
				{
					title: "Navigation Stacks, Tabs, and Sheets",
					content:
						"Introduce the major navigation patterns students will actually use in beginner apps: stack navigation, tab navigation, and sheet presentation. Explain when each pattern fits and how data moves across screen boundaries."
				},
				{
					title: "Worked Example Set: Passing Data Between Screens",
					content:
						"Build small examples where a list leads to a detail page, a tab owns a subsection of the app, and a sheet presents supporting content. Keep the focus on keeping navigation intentional rather than piling screens on top of each other."
				},
				{
					title: "Project: Multi-Tab Hobby App",
					content:
						"Build a hobby app with multiple tabs, a home dashboard, a simple schedule, and a favorites or saved-items area. This project gives students a realistic app shell and forces them to think about shared state, routing, and what belongs on each top-level screen.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/solution"
				},
				{
					title: "Reflection Question: What Deserves a Tab vs a Drill-Down Screen?",
					content:
						"Defend which parts of an app should be top-level destinations and which should be reached only from context. This improves product thinking as well as navigation structure."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain the role of a `NavigationStack`, a `TabView`, and a sheet without using them interchangeably. Prompt: 'Why should favorites be a tab in one app but a detail section in another?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD3-Multi-Tab-Hobby-App/solution"
				},
				{
					title: "Navigation and Multi Screen Apps supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD12 Navigation and Multi-Screen Apps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-22-sad12-navigation-and-multi-screen-apps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-22-sad12-navigation-and-multi-screen-apps-supplemental-2/solution"
				},
				{
					title: "Navigation and Multi Screen Apps supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD12 Navigation and Multi-Screen Apps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-23-sad12-navigation-and-multi-screen-apps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-23-sad12-navigation-and-multi-screen-apps-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD13 Lists, Forms, and CRUD Patterns",
			curriculum: [
				{
					title: "Editable Lists and Forms",
					content:
						"Introduce lists and forms as the backbone of many practical apps. Show how add, edit, delete, and completion-style workflows turn a static SwiftUI demo into a real data-driven product."
				},
				{
					title: "Worked Example Set: Add, Toggle, and Delete",
					content:
						"Work small examples for creating new items from form inputs, toggling item state, and deleting rows cleanly. Explain why clean data mutation matters just as much as polished layout."
				},
				{
					title: "Project: Simple Tracker App",
					content:
						"Build a simple tracker app with a creation flow, a list of items, completion toggles, and deletion support. This project is the main foundation for the later persistence module, so Keep the code organized enough to evolve rather than rewrite.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Reflection Question: What Makes CRUD Feel Predictable?",
					content:
						"Explain which interactions in a tracker app should feel immediate and which ones need more guardrails or confirmation. This connects interface design to data integrity."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: add an item, mutate one property on an existing item, and delete a row without introducing unclear ownership or stale UI. Prompt: describe what should happen to the list after an add form succeeds.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Lists, Forms, and CRUD Patterns supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD13 Lists, Forms, and CRUD Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-24-sad13-lists-forms-and-crud-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-24-sad13-lists-forms-and-crud-patterns-supplemental-2/solution"
				},
				{
					title: "Lists, Forms, and CRUD Patterns supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD13 Lists, Forms, and CRUD Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-25-sad13-lists-forms-and-crud-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-25-sad13-lists-forms-and-crud-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD14 Media, Maps, and Device Features",
			curriculum: [
				{
					title: "Images, Icons, Maps, and Permissions",
					content:
						"Introduce richer app features through media and maps, but keep permissions and device integration at a practical high level. Explain where assets live, how SF Symbols and images differ, and why hardware-linked features add responsibility as well as excitement."
				},
				{
					title: "Project: Media Gallery App",
					content:
						"Build a gallery app that uses structured media data, a grid or scrolling presentation, and a richer detail view. This project is about repeated layout, clear data modeling, and making a browsing interface feel intentional.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/solution"
				},
				{
					title: "Project: Map Places App",
					content:
						"Build a places app that combines a list of locations with a map view and simple place metadata. Use this to teach map-centered UI, selection-driven detail, and the basic shape of a location feature before deeper production concerns.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD4-Map-Places-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD4-Map-Places-App/solution"
				},
				{
					title: "Reflection Question: When Does a Feature Need Permission Planning?",
					content:
						"Explain which device-linked features feel simple in a demo but require more thoughtful permission messaging or privacy planning in a real app. The point is to connect feature excitement to product responsibility."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: describe when an app should use bundled assets versus remote media, and how a list selection should influence a map-centered view. Prompt: 'What has to happen in the app before a location permission request makes sense?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD2-Media-Gallery-App/solution"
				},
				{
					title: "Media, Maps, and Device Features supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD14 Media, Maps, and Device Features",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-26-sad14-media-maps-and-device-features-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-26-sad14-media-maps-and-device-features-supplemental-2/solution"
				},
				{
					title: "Media, Maps, and Device Features supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD14 Media, Maps, and Device Features",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-27-sad14-media-maps-and-device-features-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-27-sad14-media-maps-and-device-features-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD15 Networking and Data Loading",
			curriculum: [
				{
					title: "APIs, JSON, and Async Loading",
					content:
						"This section covers networking as a structured workflow: request data, decode JSON, represent loading state, represent error state, and render success cleanly. Most app-networking bugs are state and architecture problems as much as syntax problems."
				},
				{
					title: "Worked Example Set: Loading, Loaded, and Failed UI States",
					content:
						"Compare empty, loading, loaded, and failed states for the same feature so students stop assuming the success view is the whole feature. Explain why async/await improves clarity but does not remove the need for explicit state modeling."
				},
				{
					title: "Project: API-Powered Reference App",
					content:
						"Build a simple reference app backed by a public JSON endpoint. Decode entries, show a loading indicator, handle failure gracefully, and add at least a small search or filtering experience so the result feels like an app, not just a fetch demo.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/solution"
				},
				{
					title: "Reflection Question: Why Is the Loading State Part of the Product?",
					content:
						"Explain why the user experience of waiting, retrying, or failing to load is part of the app's design quality, not just an engineering detail. This helps prevent the common beginner habit of only building the happy path."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain the full path from URL to decoded model to visible list row, and name the UI states the feature must represent. Prompt: 'What should the app do before the first response arrives?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD6-API-Reference-App/solution"
				},
				{
					title: "Networking and Data Loading supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD15 Networking and Data Loading",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-28-sad15-networking-and-data-loading-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-28-sad15-networking-and-data-loading-supplemental-2/solution"
				},
				{
					title: "Networking and Data Loading supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD15 Networking and Data Loading",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-29-sad15-networking-and-data-loading-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-29-sad15-networking-and-data-loading-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD16 Persistence",
			curriculum: [
				{
					title: "Local Data That Survives Relaunch",
					content:
						"Introduce `UserDefaults`, file storage, and the idea of local persistence before mentioning larger systems like SwiftData or Core Data. Emphasize that persistence changes product expectations: a tracker that forgets everything is not the same product as one that remembers."
				},
				{
					title: "Worked Example Set: Save, Load, and Default Data",
					content:
						"Compare the first-launch state, a saved returning state, and a fallback or reset path. Use these examples to show why persistence logic needs just as much structure as the visible list UI."
				},
				{
					title: "Project Pass: Persist the Simple Tracker App",
					content:
						"Return to the tracker app and add local persistence so items survive app relaunches. Connect a lightweight store, encode/decode the list data, and keep the add/toggle/delete flows working after persistence is introduced.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Reflection Question: What Changes Once Data Lasts?",
					content:
						"Explain how persistence changes testing, debugging, and user expectations. They should identify at least one new edge case that only appears after data survives between launches."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain where persistent data is loaded, when it should be saved, and what should happen if stored data is missing or malformed. Prompt: compare a first launch with a tenth launch.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD5-Simple-Tracker-App/solution"
				},
				{
					title: "Persistence supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD16 Persistence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-30-sad16-persistence-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-30-sad16-persistence-supplemental-2/solution"
				},
				{
					title: "Persistence supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD16 Persistence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-31-sad16-persistence-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-31-sad16-persistence-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD17 Debugging and Testing",
			curriculum: [
				{
					title: "Debugging as Observation",
					content:
						"This section covers debugging as a disciplined observation process rather than trial-and-error clicking. Review console logs, breakpoints, previews, and the role of small reproducible cases in SwiftUI app work."
				},
				{
					title: "Worked Example Set: UI Bug vs Data Bug vs Build Bug",
					content:
						"Compare a broken layout, a bad state update, and a configuration/build issue so students learn to classify problems before they attack them. This helps keep debugging efficient and calm."
				},
				{
					title: "Practical Walkthrough: Previews and Basic Test Concepts",
					content:
						"Use previews for fast UI checks and introduce simple unit and UI test ideas conceptually. Key idea: Testing is about confidence and regression prevention, even if they are not writing a large suite yet."
				},
				{
					title: "Reflection Question: Which Signal Do You Trust First?",
					content:
						"Name which debugging signals they trust most in different situations: preview behavior, runtime logs, breakpoint inspection, or user reproduction steps. This builds troubleshooting judgment instead of rote habits."
				},
				{
					title: "SAD17 Debugging and Testing: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro3"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: choose a debugging tool that matches the kind of failure and explain the difference between a preview issue and a runtime issue. Prompt: 'If the layout looks wrong but the data is correct, where do you inspect first?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod4Pro3"
				},
				{
					title: "Debugging and Testing supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-32-sad17-debugging-and-testing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-32-sad17-debugging-and-testing-supplemental-2/solution"
				},
				{
					title: "Debugging and Testing supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD17 Debugging and Testing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-33-sad17-debugging-and-testing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-33-sad17-debugging-and-testing-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD18 App Design and Accessibility",
			curriculum: [
				{
					title: "Readability, Spacing, and Touch Targets",
					content:
						"Introduce design quality as part of app quality rather than an optional finishing layer. Cover typography, spacing, visual hierarchy, touch target sizing, dark-mode resilience, and why accessible structure makes the app better for everyone."
				},
				{
					title: "Worked Example Set: Polishing a Rough Screen",
					content:
						"Take a rough SwiftUI screen and improve hierarchy, spacing, labeling, and contrast deliberately. Many 'ugly app' problems are really clarity problems."
				},
				{
					title: "Practice Lab: Accessibility Labels and Content Review",
					content:
						"Add accessibility labels to interactive controls and review whether the screen still makes sense with large text and clear spoken descriptions. Use this to build a baseline accessibility habit instead of treating it as a late compliance task."
				},
				{
					title: "Reflection Question: What Makes an App Feel Intentionally Designed?",
					content:
						"Identify the difference between a screen that merely functions and a screen that feels deliberate, readable, and respectful of the user. They should reference both aesthetics and accessibility."
				},
				{
					title: "SAD18 App Design and Accessibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro1"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify at least three design or accessibility problems in a rough screen and suggest concrete fixes. Prompt: 'Would this still work well with large dynamic type?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro1"
				},
				{
					title: "App Design and Accessibility supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-34-sad18-app-design-and-accessibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-34-sad18-app-design-and-accessibility-supplemental-2/solution"
				},
				{
					title: "App Design and Accessibility supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD18 App Design and Accessibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-35-sad18-app-design-and-accessibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-35-sad18-app-design-and-accessibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD19 Final Publishing Walkthrough",
			curriculum: [
				{
					title: "Archive, Upload, and Release Checklists",
					content:
						"Walk through the final publishing path conceptually before the capstone wrap-up: archive build, upload process, App Store Connect checklists, TestFlight release, and review basics. Key idea: The release path as an ordered workflow, not a final mysterious button."
				},
				{
					title: "Practical Walkthrough: Build Metadata and Preflight Review",
					content:
						"Review version/build numbers, screenshots, descriptions, icons, support information, and tester notes as one preflight package. Connect this directly to what students will need for the capstone even if they only simulate the publishing path."
				},
				{
					title: "Practical Walkthrough: TestFlight and Submission Basics",
					content:
						"Compare releasing to internal testers, preparing an external test, and sending an app to App Review. Explain what happens after upload so students understand the administrative side of shipping."
				},
				{
					title: "Reflection Question: What Still Needs to Be True After the App 'Works'?",
					content:
						"List the non-code requirements that must still be satisfied after the product itself feels feature-complete. This reinforces the full-stack product mindset of the course."
				},
				{
					title: "SAD19 Final Publishing Walkthrough: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD19 Final Publishing Walkthrough",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro2"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: outline the order of archive, upload, metadata review, TestFlight, and App Review without skipping critical steps. Prompt: identify which publishing artifact should be prepared before the final upload begins.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/Mod5Pro2"
				},
				{
					title: "Final Publishing Walkthrough supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD19 Final Publishing Walkthrough",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-36-sad19-final-publishing-walkthrough-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-36-sad19-final-publishing-walkthrough-supplemental-2/solution"
				},
				{
					title: "Final Publishing Walkthrough supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD19 Final Publishing Walkthrough",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-37-sad19-final-publishing-walkthrough-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-37-sad19-final-publishing-walkthrough-supplemental-3/solution"
				}
			]
		},
		{
			title: "SAD20 Capstone App",
			curriculum: [
				{
					title: "Scope a Capstone Like a Real App",
					content:
						"Frame the capstone as a coherent app that can realistically be tested and presented, not as a dumping ground for every feature learned in the course. The project definition should include scope, audience, primary user flow, and the minimum set of features that make the app worth testing."
				},
				{
					title: "Build Phase: Implement, Test, and Polish",
					content:
						"Build the capstone in small passes: core navigation and data first, then persistence or networking if needed, then polish, accessibility, and release-readiness checks. Use the final project to revisit architecture, debugging, and quality tradeoffs in one place."
				},
				{
					title: "Project: Publish-Ready Capstone App",
					content:
						"Use the capstone starter as a shipping-minded shell for a final app that includes intentional navigation, polished core screens, accessibility review, and store/testing preparation notes. Skill target: Explain not only what the app does, but how they would prepare it for TestFlight or the App Store.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/solution"
				},
				{
					title: "Reflection Question: What Did You Learn About Shipping, Not Just Coding?",
					content:
						"Explain which parts of the course most changed how they think about building for Apple platforms. They should mention at least one setup, architecture, testing, accessibility, or publishing lesson in addition to SwiftUI code."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: defend the capstone scope, explain navigation and data choices, and outline a plausible TestFlight/App Store preparation path. Prompt: 'If you had one more week, what would you improve before inviting external testers?'",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD7-Publish-Ready-Capstone/solution"
				},
				{
					title: "Capstone App supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD20 Capstone App",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-38-sad20-capstone-app-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-38-sad20-capstone-app-supplemental-2/solution"
				},
				{
					title: "Capstone App supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle: "SAD20 Capstone App",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-39-sad20-capstone-app-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-39-sad20-capstone-app-supplemental-3/solution"
				}
			]
		},
		{
			title: "SADX Enrichment and Legacy Archive Boundaries",
			curriculum: [
				{
					title: "Canonical Swift Repo Structure",
					content:
						"Treat the `SAD1` through `SAD7` projects as the canonical active course path. The older `Mod1Pro*` through `Mod5Pro*` folders remain in the repo as archive material rather than as a second competing sequence."
				},
				{
					title: "Legacy Means Reference, Not Core Scope",
					content:
						"Keep the `legacy/` materials and the older `Mod*` folders available only for historical demo recovery or scaffold comparison. They should not re-enter the main public course flow."
				},
				{
					title: "Shapes Studio as Intentional Enrichment",
					content:
						"Expose `SADX-SwiftUI-Shapes-Studio` as optional enrichment because it still reinforces useful SwiftUI drawing and layout ideas, but it sits outside the main shipping-app spine."
				},
				{
					title: "SADX Enrichment and Legacy Archive Boundaries: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Swift",
						moduleTitle:
							"SADX Enrichment and Legacy Archive Boundaries",
						section: "verification"
					})
				},
				{
					title: "SADX Enrichment and Legacy Archive Boundaries: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SADX Enrichment and Legacy Archive Boundaries",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: SwiftUI Shapes Studio",
					content:
						"Use the shapes-focused enrichment pack for extra practice with paths, custom drawing, and SwiftUI composition after the main course flow is stable.",
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-Swift-UI-Shapes-Studio/solution"
				},
				{
					title: "SADX Enrichment and Legacy Archive Boundaries supplemental 2",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SADX Enrichment and Legacy Archive Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-40-sadx-enrichment-and-legacy-archive-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-40-sadx-enrichment-and-legacy-archive-boundaries-supplemental-2/solution"
				},
				{
					title: "SADX Enrichment and Legacy Archive Boundaries supplemental 3",
					content: buildProjectGuidance({
						courseFamily: "Swift app",
						moduleTitle:
							"SADX Enrichment and Legacy Archive Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-41-sadx-enrichment-and-legacy-archive-boundaries-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Swift/tree/main/SAD-41-sadx-enrichment-and-legacy-archive-boundaries-supplemental-3/solution"
				}
			]
		}
	]
};
