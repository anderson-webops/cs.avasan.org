import type { RawCourse } from "./types";

export const introToSwiftAppDevelopmentCourse: RawCourse = {
	name: "Intro to Swift App Development",
	modules: [
		{
			title: "AD1 Starting in Swift",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"Get familiar with the learner portal, the course structure, and the Swift development workflow. This course requires Xcode on a Mac, since SwiftUI apps are built and previewed there."
				},
				{
					title: "Xcode Setup",
					content:
						"Install or open Xcode, create a new iOS App project, and review the main parts of the workspace such as the code editor, preview canvas, project navigator, and inspector."
				},
				{
					title: "Hello World",
					content:
						'Explore the basic structure of a SwiftUI app by looking at `import SwiftUI`, `struct ContentView: View`, and `var body: some View`. Create a `Text("Hello World")` view and customize it with styling such as font, color, padding, alignment, and multiline formatting.',
					solutionLink:
						"https://replit.com/@JuniLearning/Mod1Pro1#main.swift"
				},
				{
					title: "Images",
					content:
						"Upload an image into the asset catalog, display it in SwiftUI, and compare `.aspectRatio(contentMode: .fit)` with `.fill`. Then place styled text on top of the image using `overlay` to create a simple title-screen layout.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod1Pro2#main.swift"
				},
				{
					title: "New Page",
					content:
						"Create multiple files and navigate between them with `NavigationView` and `NavigationLink`. Build a simple menu where each piece of text opens a different destination page.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod1Pro3#main.swift"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AD2 Learning about Structs and Stack views",
			curriculum: [
				{
					title: "New Pages Pt. 2",
					content:
						"Learn the difference between `ZStack`, `HStack`, and `VStack`, and use them to lay out text and images in different ways. Build an About Me page and choose the stack that best fits the information being shown.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod2Pro1#one.swift"
				},
				{
					title: "Creating Views with Struct",
					content:
						"Use a custom struct as a reusable view template. Build a `CharacterView` that stores properties such as a name, image, source, and description, then reuse that structure to display more than one character cleanly.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod2Pro2#main.swift"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AD3 Working with lists and state variables",
			curriculum: [
				{
					title: "Art Gallery",
					content:
						"Create arrays to store related image names and captions, access them by index, and display one item at a time. Introduce `@State` and `@Binding` so a button can move through the gallery and loop back to the beginning after the last item.",
					solutionLink: "https://replit.com/@JuniLearning/Mod3Pro1"
				},
				{
					title: "Swiping Art Gallery",
					content:
						"Build a scrollable gallery using a reusable artwork struct, a `ScrollView`, and a `Group` of repeated entries. Compare this approach with the button-based gallery and decide when scrolling is a better fit than switching one item at a time.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod3Pro2#ContentView.swift"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AD4 SwiftUI Shapes",
			curriculum: [
				{
					title: "Classic Shapes",
					content:
						"Create rectangles, circles, and ellipses in SwiftUI, then customize them with modifiers such as `foregroundColor`, `frame`, and `offset`. Use those primitives to assemble a simple drawing.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod4Pro1#ContentView.swift"
				},
				{
					title: "Pie Chart",
					content:
						"Use `Path`, `CGPoint`, arcs, fills, strokes, and `closeSubpath()` to build custom shapes that go beyond the built-in shape types. Apply those tools to create a personal pie chart connected to a hobby or interest.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod4Pro2#ContentView.swift"
				},
				{
					title: "Create Your Own Monster",
					content:
						"Combine SwiftUI shapes and custom paths to design an original monster illustration with a layout and style of your choice.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod4Pro3#ContentView.swift"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AD5 Learning about lists and landmarks",
			curriculum: [
				{
					title: "Landmark Introduction",
					content:
						"Create a landmark page that combines text, an image, and a map. Use `MapKit`, `MKCoordinateRegion`, latitude and longitude values, and a reusable `MapView` struct to show a meaningful location.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod5Pro1#ContentView.swift"
				},
				{
					title: "Map Gallery",
					content:
						"Extend the earlier gallery ideas to maps by rotating through different landmark views. Reuse structs and changing coordinate values to create a gallery of locations.",
					solutionLink:
						"https://replit.com/@JuniLearning/Mod5Pro2?v=1"
				}
			],
			supplementalProjects: []
		},
		{
			title: "AD6 Master Project",
			curriculum: [
				{
					title: "Master Project",
					content:
						"Design and build an original SwiftUI app centered around a hobby, interest, or real-world use case. The final app should include at least three pages, navigation between them, at least one map, and at least three images."
				},
				{
					title: "Project Planning and Scope",
					content:
						"Break the app into smaller steps before coding. Start with the core screens and navigation, then add supporting features such as galleries, maps, or structured detail views."
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including text and image views, navigation, stacks, structs, arrays, state, shapes, maps, and building a multi-page app."
				}
			],
			supplementalProjects: []
		}
	]
};
