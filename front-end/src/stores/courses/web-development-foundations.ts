import type { RawCourse } from "./types";

export const webDevelopmentFoundationsCourse: RawCourse = {
	name: "Web Development Foundations",
	modules: [
		{
			title: "WDF0 Setup and Tooling",
			curriculum: [
				{
					title: "Normalize File-Based Local Development Early",
					content:
						"Set the course expectation that students will work in real project folders on disk rather than only in browser playgrounds. The editor is important, but the core habit is learning to manage files, terminals, local servers, and project structure in a way that prepares students for frameworks, back ends, hosting, and team collaboration."
				},
				{
					title: "Preferred IDEs and Core Extensions",
					content:
						"Recommend `WebStorm` or `VS Code` and explain that the choice matters less than having strong support for project navigation, linting, formatting, Git, and integrated terminals. If students choose VS Code, make `ESLint`, `Prettier`, and `EditorConfig` early defaults, with `GitLens` or remote-development tools added only when they clarify the workflow rather than distract from it."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install Node.js LTS, the chosen editor, and verify that `node`, `npm`, and a local dev server` all work before moving into frameworks or deployment. On Windows, do the same and teach path handling, terminals, and environment variables early so hosting and backend topics do not feel like a second course with different rules."
				},
				{
					title: "Course Workspace and Folder Structure",
					content:
						"Create a workspace with folders for `html-css`, `javascript`, `full-stack`, and `deployment` so the course can evolve from static front-end work to server-backed projects without losing organization. This structure also gives students a concrete sense that front-end code, server code, deployment notes, and operational files often belong in related but distinct places."
				},
				{
					title: "Early Module on Browser Devtools, Git, npm, and Project Structure",
					content:
						"Before deeper framework or hosting topics appear, teach browser devtools, Git/GitHub basics, npm, and project layout as recurring strands. The goal is to stop deployment and back-end material from feeling disconnected by making inspection, version control, and package management part of normal development from the beginning."
				},
				{
					title: "WDF0 Setup and Tooling: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Setup and Tooling",
					content:
						"Keep a running notebook for setup and tooling that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on editor setup, terminal usage, npm verification, and local server startup so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-wdf0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-wdf0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF0 Setup and Tooling. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-wdf0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-wdf0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF1 Positioning, Goals, and Suggested Course Family",
			curriculum: [
				{
					title: "Why the JavaScript Path Should Expand into Web Development",
					content:
						"Position this course as the bridge from browser-focused JavaScript to full web-development fluency. The current JavaScript courses are still valuable for programming, DOM work, and browser APIs, but students should now learn how those skills connect to project structure, back-end services, databases, deployment, hosting, and operations."
				},
				{
					title: "Main Goals of the Expanded Path",
					content:
						"State the four main goals clearly: turn browser-focused JavaScript into full web-development fluency, add practical hosting and deployment knowledge, connect front end, back end, databases, and networking, and prepare students to publish real projects rather than only local demos. These goals should be revisited whenever a new unit risks feeling isolated from the rest of the stack."
				},
				{
					title: "Suggested Course Family and Placement",
					content:
						"Describe the broader family as `JavaScript Level 1`, `JavaScript Level 2`, `Web Development Foundations`, `Full-Stack Web Apps`, and optionally `Deployment and Cloud Hosting`. This course should feel like the first place where all of those later directions become visible and where students see how front-end practice grows into publishing and operations work."
				},
				{
					title: "Entry Expectations from JavaScript Level 1 and 2",
					content:
						"Students entering this course should already be comfortable reading and writing small-to-medium JavaScript programs, working with HTML and CSS, manipulating the DOM, responding to events, and reasoning about APIs and basic data models. This course can briefly reinforce those ideas, but it should not spend most of its time reteaching them. The real transition is from `browser-only projects` into `file-based local development, Git, npm, dev servers, back-end services, databases, and deployment`. Strong JavaScript Level 2 students may move quickly through the early setup material, but they should still take it because workflow and environment habits are now part of the curriculum, not optional side topics."
				},
				{
					title: "What This Course Is Not",
					content:
						"Clarify that the course is not only about memorizing frameworks or copying tutorial steps. It is about learning repeatable workflows, strong project boundaries, debugging discipline, and enough operational understanding that students can explain how a site is built, served, configured, and observed after launch."
				},
				{
					title: "WDF1 Positioning, Goals, and Suggested Course Family: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-fami/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-fami/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Positioning and Goals",
					content:
						"Keep a running notebook for positioning and goals that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on how each new topic connects back to publishing, hosting, or operations so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-fami/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf1-positioning-goals-and-suggested-course-fami/solution"
				},
				{
					title: "Positioning, Goals, and Suggested Course Family supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF1 Positioning, Goals, and Suggested Course Family. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-wdf1-positioning-goals-and-suggested-course-fami/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-wdf1-positioning-goals-and-suggested-course-fami/solution"
				},
				{
					title: "Positioning, Goals, and Suggested Course Family supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF1 Positioning, Goals, and Suggested Course Family. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-wdf1-positioning-goals-and-suggested-course-fami/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-wdf1-positioning-goals-and-suggested-course-fami/solution"
				}
			]
		},
		{
			title: "WDF2 Stage 1: Strengthen the Existing JavaScript Courses",
			curriculum: [
				{
					title: "Keep HTML, CSS, DOM, and APIs as the Base",
					content:
						"Do not throw away the browser fundamentals that made the JavaScript path strong. Keep HTML, CSS, DOM work, and APIs as the technical base, but teach them inside real project folders so students practice navigation, file structure, asset management, and version control at the same time they practice browser logic."
				},
				{
					title: "Use More File-Based Local Projects, Not Only CodePen",
					content:
						"Shift students toward local, file-based projects with deliberate naming, folders, and scripts. This matters because deployment, build tools, frameworks, and full-stack work all assume that learners understand what it means to create, edit, run, and organize a project on disk."
				},
				{
					title: "Add Git and GitHub as Normal Workflow Tools",
					content:
						'Teach repository initialization, commit hygiene, branch awareness, and remote publishing as part of normal development rather than as an optional add-on after the code is "done." Students should connect Git not only to collaboration, but to safe experimentation, rollback, and project history during longer builds.'
				},
				{
					title: "Make Browser Devtools a Recurring Strand",
					content:
						"Use devtools in every major JavaScript or browser module so debugging becomes routine. Console inspection, network tabs, layout inspection, storage inspection, and source maps should feel like part of the normal development loop, especially before students move into frameworks and back ends where the debugging surface becomes larger."
				},
				{
					title: "WDF2 Stage 1: Strengthen the Existing JavaScript Courses: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Strengthen the Existing JavaScript Courses",
					content:
						"Keep a running notebook for strengthen the existing javascript courses that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on Git checkpoints, local project organization, and devtools usage so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf2-stage-1-strengthen-the-existing-javascript-/solution"
				},
				{
					title: "Stage 1: Strengthen the Existing JavaScript Courses supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF2 Stage 1: Strengthen the Existing JavaScript Courses. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf2-stage-1-strengthen-the-existing-javascript-/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-05-wdf2-stage-1-strengthen-the-existing-javascript-/solution"
				},
				{
					title: "Stage 1: Strengthen the Existing JavaScript Courses supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF2 Stage 1: Strengthen the Existing JavaScript Courses. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf2-stage-1-strengthen-the-existing-javascript-/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-06-wdf2-stage-1-strengthen-the-existing-javascript-/solution"
				}
			]
		},
		{
			title: "WDF3 Stage 2: Web Development Foundations",
			curriculum: [
				{
					title: "Project Structure and Front-End Workspace Habits",
					content:
						"Teach students how to separate HTML, CSS, JavaScript, assets, configuration, and build outputs so a project stays understandable as it grows. This is where naming conventions, folder boundaries, and deliberate entry points become part of the course, because hosting and build tooling depend on those structural habits later."
				},
				{
					title: "npm and Package Management",
					content:
						"Introduce npm as the mechanism for package installation, scripts, and local tooling rather than as a magical prerequisite for frameworks. Students should understand what `package.json` is for, why dependencies and devDependencies differ, and how scripts like `dev`, `build`, and `start` capture repeatable project behavior."
				},
				{
					title: "Modules, Bundlers, and Local Dev Servers at a Gentle Level",
					content:
						"Explain JavaScript modules, bundlers, and local dev servers without overwhelming students with toolchain internals. The important lesson is that modern web development often turns many source files into a smaller deployable build and that a local server is part of the workflow even for front-end-only projects."
				},
				{
					title: "Environment Variables, Forms, and Validation",
					content:
						"Teach environment variables as configuration boundaries rather than as secret magic strings. Pair that lesson with forms and validation so students learn early that user input and deployment configuration are both data surfaces that need explicit handling, clear defaults, and careful debugging."
				},
				{
					title: "WDF3 Stage 2: Web Development Foundations: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Portfolio Site with Custom Domain Preparation",
					content:
						"Use the portfolio lab to turn a file-based front-end project into something that is ready for a local dev server, static build, and later custom-domain deployment. This project should make students practice npm scripts, asset organization, responsive layout, and a publishing checklist instead of treating the portfolio as a throwaway page.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Stage 2: Web Development Foundations supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF3 Stage 2: Web Development Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf3-stage-2-web-development-foundations-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-07-wdf3-stage-2-web-development-foundations-supplem/solution"
				},
				{
					title: "Stage 2: Web Development Foundations supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF3 Stage 2: Web Development Foundations. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf3-stage-2-web-development-foundations-supplem/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf3-stage-2-web-development-foundations-supplem/solution"
				}
			]
		},
		{
			title: "WDF4 Stage 3: Front-End Applications",
			curriculum: [
				{
					title: "Modern UI Composition",
					content:
						"Move from small DOM exercises to reusable UI composition so students start thinking in views, components, states, and boundaries. Even before a specific framework becomes central, learners should understand how modern front-end code organizes reusable parts and why that makes complex interfaces easier to debug and extend."
				},
				{
					title: "Routing and Multi-View Thinking",
					content:
						"Teach client-side routing as a way to represent multiple screens or views in one application without reloading the entire page. Students should connect this to information architecture, URL design, and the idea that front-end applications need deliberate navigation structures rather than one growing script file."
				},
				{
					title: "State Management Basics and Async Data Loading",
					content:
						"Explain local state, shared state, and asynchronous data loading at a practical level. Students do not need advanced theory first; they need to understand where data lives, how it changes, and how to model loading, success, empty, and error states without confusing the user interface or the developer."
				},
				{
					title: "Accessibility and Responsive Design as Core Requirements",
					content:
						"Treat accessibility and responsive design as first-class constraints in front-end work rather than polish for the end. Students should practice semantic HTML, keyboard access, readable contrast, flexible layouts, and content priorities across screen sizes so their app work is credible outside a demo environment."
				},
				{
					title: "WDF4 Stage 3: Front-End Applications: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Real-Time Chat or Notification App",
					content:
						"Use the real-time chat lab to show how front-end application state, live updates, and interface composition change once events start arriving continuously rather than only through one-off HTTP requests. This project should also reinforce responsive layout, input validation, and the user experience of joining, sending, and receiving updates.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				},
				{
					title: "Stage 3: Front End Applications supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF4 Stage 3: Front-End Applications. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf4-stage-3-front-end-applications-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf4-stage-3-front-end-applications-supplemental/solution"
				},
				{
					title: "Stage 3: Front End Applications supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF4 Stage 3: Front-End Applications. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf4-stage-3-front-end-applications-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf4-stage-3-front-end-applications-supplemental/solution"
				}
			]
		},
		{
			title: "WDF5 Stage 4: Back-End Basics",
			curriculum: [
				{
					title: "Node.js Runtime and Server-Side JavaScript",
					content:
						"Introduce Node.js as the runtime that lets JavaScript move from the browser into server work, tooling, and automation. Students should understand that the same language now runs in a different environment with different APIs, different security boundaries, and a different responsibility for input handling and process lifecycle."
				},
				{
					title: "Express or Fastify as the API Surface",
					content:
						"Use Express or Fastify to show how server applications define routes, parse requests, return responses, and structure middleware or validation steps. The framework is not the end goal; the goal is helping students model how a browser or front-end app talks to a server in a predictable, inspectable way."
				},
				{
					title: "REST APIs, Request Validation, and Error Shapes",
					content:
						'Teach simple RESTful patterns and pair them immediately with request validation and explicit error handling. Students should understand that an API is more than a route that "works"; it is a contract that must handle missing fields, invalid payloads, malformed input, and repeatable response shapes.'
				},
				{
					title: "Auth Basics and Session vs Token Concepts",
					content:
						"Introduce authentication at a conceptual level by distinguishing identity, authorization, sessions, and tokens. Students do not need a complete production auth system here, but they should understand why login state, cookies, bearer tokens, and protected routes change the design of both front-end and back-end code."
				},
				{
					title: "WDF5 Stage 4: Back-End Basics: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Booking or Contact App with Email Integration",
					content:
						"Use the booking/contact lab to make request validation, environment variables, and server-side delivery logic concrete. Students should handle public form input on the client, validate it again on the server, and understand that email configuration belongs in environment settings rather than in shipped client code.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				},
				{
					title: "Stage 4: Back End Basics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF5 Stage 4: Back-End Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf5-stage-4-back-end-basics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf5-stage-4-back-end-basics-supplemental-2/solution"
				},
				{
					title: "Stage 4: Back End Basics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF5 Stage 4: Back-End Basics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-12-wdf5-stage-4-back-end-basics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-12-wdf5-stage-4-back-end-basics-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF6 Stage 5: Databases and Data Models",
			curriculum: [
				{
					title: "MongoDB Basics and Data Modeling",
					content:
						"Teach MongoDB as a practical entry point into document databases and data models. Students should learn what a collection and document are, how application code maps user-facing features onto stored data, and why schema thinking still matters even in a NoSQL environment."
				},
				{
					title: "Schemas, Validation, and CRUD",
					content:
						'Use a schema layer such as Mongoose to connect data modeling to validation and CRUD routes. The lesson is that storage is not just "put data somewhere"; it is defining what valid data looks like, how it is created, read, updated, and deleted, and how those constraints improve application reliability.'
				},
				{
					title: "Indexes at a High Level",
					content:
						"Introduce indexes conceptually rather than as a deep database-internals topic. Students should understand that indexes trade extra storage and write cost for faster queries and that data shape and access patterns influence performance long before a project becomes large."
				},
				{
					title: "When to Choose SQL vs NoSQL",
					content:
						"Give students a comparison framework instead of rigid rules. Show how structured relationships, transactional needs, and reporting often push toward SQL, while flexible document shapes and certain rapid prototypes can fit NoSQL well, then stress that the right choice depends on the product's data behavior and future needs."
				},
				{
					title: "WDF6 Stage 5: Databases and Data Models: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Blog or Notes App with MongoDB",
					content:
						"Use the notes app lab to combine MongoDB basics, schemas, validation, and CRUD in a full-stack workflow. Students should be able to explain how the browser talks to the API, how the API validates payloads, how the database stores notes, and why a simple index or schema constraint improves the project beyond a basic demo.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				},
				{
					title: "Stage 5: Databases and Data Models supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF6 Stage 5: Databases and Data Models. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-13-wdf6-stage-5-databases-and-data-models-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-13-wdf6-stage-5-databases-and-data-models-supplemen/solution"
				},
				{
					title: "Stage 5: Databases and Data Models supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF6 Stage 5: Databases and Data Models. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-14-wdf6-stage-5-databases-and-data-models-supplemen/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-14-wdf6-stage-5-databases-and-data-models-supplemen/solution"
				}
			]
		},
		{
			title: "WDF7 Stage 6: Hosting and Deployment",
			curriculum: [
				{
					title: "Domain Names, DNS, and Deployment Targets",
					content:
						'Teach students how domain names, DNS records, and deployment targets fit together so publishing feels concrete. A deployed project is not just "on the internet"; it has a hosting surface, a domain, DNS configuration, environment settings, and a verification story after each change.'
				},
				{
					title: "Static Hosting vs App Hosting",
					content:
						"Explain the difference between static hosting and application hosting in terms of build output, runtime needs, scalability, and operational complexity. This is the point where students should understand why a front-end portfolio can live on a static platform while a server-backed app needs a runtime environment, logs, and often a database connection."
				},
				{
					title: "Reverse Proxies, Environment Configuration, Monitoring, and Logs",
					content:
						"Teach reverse proxies, environment configuration, monitoring, and logs as part of deployment rather than as optional operations trivia. Students should see that deployment quality depends on observability, configuration boundaries, and the ability to distinguish front-end failures from API failures after the project leaves localhost."
				},
				{
					title: "Deployment as a Repeatable Process",
					content:
						"Make deployment repeatable by teaching build scripts, environment-specific configuration, domain verification, and post-deploy checks. Students should end this stage able to describe what they would test immediately after shipping a site or app and what evidence they would collect if something broke."
				},
				{
					title: "WDF7 Stage 6: Hosting and Deployment: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ship a Front End and Back End Separately",
					content:
						"Use the deployment lab to separate front-end and back-end hosting concerns on purpose. Students should configure an API base URL boundary, reason about CORS and reverse proxies, document environment differences across local and hosted environments, and verify the combined system after deploying each side independently.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				},
				{
					title: "Stage 6: Hosting and Deployment supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF7 Stage 6: Hosting and Deployment. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-15-wdf7-stage-6-hosting-and-deployment-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-15-wdf7-stage-6-hosting-and-deployment-supplemental/solution"
				},
				{
					title: "Stage 6: Hosting and Deployment supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF7 Stage 6: Hosting and Deployment. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-16-wdf7-stage-6-hosting-and-deployment-supplemental/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-16-wdf7-stage-6-hosting-and-deployment-supplemental/solution"
				}
			]
		},
		{
			title: "WDF8 Hosting and Operations Topics to Add",
			curriculum: [
				{
					title: "Linux and Server Basics for Web Developers",
					content:
						"Cover SSH, service processes, logs, environment files, and file locations so deployment does not stop at a platform dashboard. Students should understand enough Linux and server structure to connect code to runtime files, service processes, log locations, and safe operational changes."
				},
				{
					title: "Cloud and Platform Ideas",
					content:
						"Introduce front-end deployment platforms such as Vercel or Netlify and back-end targets such as Render, Fly.io, Railway, or a VPS. At a higher level, introduce AWS ideas including EC2 for servers, S3 for static hosting, CloudFront conceptually, Route 53 for DNS, and security groups or IAM as controlled access surfaces rather than as memorization-heavy topics."
				},
				{
					title: "Database Hosting and Recovery Basics",
					content:
						"Teach MongoDB Atlas and local MongoDB together so students can reason about development and hosted environments as related but different contexts. Add backup and restore basics so learners understand that data hosting always implies reliability planning, not just a connection string."
				},
				{
					title: "Use Hosting Topics to Connect the Whole Stack",
					content:
						"This section should unify earlier lessons by showing how front-end bundles, Node servers, databases, domains, environment variables, and logs all meet in production. The target outcome is that students can name the likely deployment surface and operational responsibility for each layer of a small web product."
				},
				{
					title: "WDF8 Hosting and Operations Topics to Add: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Hosting and Operations Topics",
					content:
						"Keep a running notebook for hosting and operations topics that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on platform choices, service ownership, log locations, and recovery planning so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-08-wdf8-hosting-and-operations-topics-to-add/solution"
				},
				{
					title: "Hosting and Operations Topics to Add supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF8 Hosting and Operations Topics to Add. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-17-wdf8-hosting-and-operations-topics-to-add-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-17-wdf8-hosting-and-operations-topics-to-add-supple/solution"
				},
				{
					title: "Hosting and Operations Topics to Add supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF8 Hosting and Operations Topics to Add. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-18-wdf8-hosting-and-operations-topics-to-add-supple/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-18-wdf8-hosting-and-operations-topics-to-add-supple/solution"
				}
			]
		},
		{
			title: "WDF9 Good Practical Projects",
			curriculum: [
				{
					title: "Project: Portfolio Site with Custom Domain",
					content:
						"Build a portfolio site that is more than a front-end design exercise by preparing it for static hosting, domain configuration, and post-launch verification. This project is the cleanest place to connect layout, accessibility, asset organization, npm scripts, and real publishing.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Project: Blog or Notes App with MongoDB",
					content:
						"Use a notes-style application to connect database modeling, CRUD routes, browser-side rendering, and validation. Students should leave the project able to describe both the user-facing behavior and the server/database flow underneath it.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF2-Notes-App-with-MongoDB/solution"
				},
				{
					title: "Project: Booking or Contact App with Email Integration",
					content:
						"This project should teach that forms do not end at the browser: contact requests need validation, transport, environment-based configuration, and a secure boundary between public inputs and private server credentials.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF3-Booking-Contact-App/solution"
				},
				{
					title: "Project: Real-Time Chat or Notification App",
					content:
						"Use a real-time project to help students reason about long-lived connections, event-driven UI updates, and the operational reality that interactive systems still need logs, deployment planning, and debugging discipline.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF4-Realtime-Chat-App/solution"
				},
				{
					title: "Project: Deployment Lab for Separate Front-End and Back-End Shipping",
					content:
						'Use a split deployment project to tie hosting, DNS, reverse proxies, environment configuration, and monitoring together. The goal is to move beyond "my app works locally" into "I can explain how the pieces are hosted, connected, and verified after release."',
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF5-Separate-Deployment-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Good Practical Projects",
					content:
						"Keep a running notebook for good practical projects that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on how each project reinforces hosting, debugging, and stack-wide reasoning so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF1-Portfolio-Custom-Domain/solution"
				},
				{
					title: "Good Practical Projects supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF9 Good Practical Projects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-19-wdf9-good-practical-projects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-19-wdf9-good-practical-projects-supplemental-2/solution"
				},
				{
					title: "Good Practical Projects supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF9 Good Practical Projects. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-20-wdf9-good-practical-projects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-20-wdf9-good-practical-projects-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF10 Suggested Advanced Strand",
			curriculum: [
				{
					title: "Logs and Uptime",
					content:
						"Add a follow-up strand focused on actual production operations, beginning with logs and uptime. Students should understand that once a project is live, part of the job is making sure it stays reachable, emits useful signals, and can be diagnosed when users report problems."
				},
				{
					title: "TLS and Reverse Proxies",
					content:
						"Introduce TLS and reverse proxies at the operational level so students learn where HTTPS termination often happens, why certificates matter, and how a reverse proxy can stand between public traffic and an app process. This gives deployment architecture more meaning than a collection of copied config snippets."
				},
				{
					title: "Backups, Environment Rotation, and Performance Basics",
					content:
						"Teach backups, environment rotation, and performance basics as a natural next step once students have published full-stack work. The lesson is that stable production systems are not only built; they are maintained, rotated, backed up, and observed over time."
				},
				{
					title: "Move from Deployment to Operations Thinking",
					content:
						"Use this advanced strand to show that deployment is the start of operational responsibility, not the end of the project. Students who complete the strand should be able to explain how they would monitor, protect, and maintain a small production system after launch."
				},
				{
					title: "WDF10 Suggested Advanced Strand: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Suggested Advanced Strand",
					content:
						"Keep a running notebook for suggested advanced strand that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on logs, uptime, certificate handling, backups, and environment rotation so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-09-wdf10-suggested-advanced-strand/solution"
				},
				{
					title: "Suggested Advanced Strand supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF10 Suggested Advanced Strand. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-21-wdf10-suggested-advanced-strand-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-21-wdf10-suggested-advanced-strand-supplemental-2/solution"
				},
				{
					title: "Suggested Advanced Strand supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF10 Suggested Advanced Strand. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-22-wdf10-suggested-advanced-strand-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-22-wdf10-suggested-advanced-strand-supplemental-3/solution"
				}
			]
		},
		{
			title: "WDF11 Integration with Network Topics",
			curriculum: [
				{
					title: "Ports and Listening Services",
					content:
						"Cross-link this course with networking by teaching ports and listening services as concrete operational facts. Students should understand that browsers, APIs, databases, and reverse proxies all communicate through explicit ports and that many deployment bugs start with services not listening where the rest of the system expects them to be."
				},
				{
					title: "DNS and Domain Routing",
					content:
						"Teach DNS and domain routing as the networking layer that makes published sites and APIs reachable. Students should be able to connect hostname records to the hosting platform or server that answers them and explain why DNS changes can affect deployment timing and rollback strategy."
				},
				{
					title: "TLS, HTTPS, and Trust Boundaries",
					content:
						"Use TLS and HTTPS to connect networking, security, and deployment. Students should understand why secure transport matters, where termination often happens, and how HTTPS relates to modern browsers, cookies, API access, and user trust."
				},
				{
					title: "Firewalls, Security Groups, and localhost vs LAN vs Public Deployment",
					content:
						"Teach the difference between `localhost`, a LAN-accessible service, and a public deployment, then connect that difference to firewalls and security groups. The important idea is that exposure level changes the security and operational assumptions of the app even when the code itself has not changed."
				},
				{
					title: "WDF11 Integration with Network Topics: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Integration with Network Topics",
					content:
						"Keep a running notebook for integration with network topics that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on ports, DNS, HTTPS boundaries, and network exposure differences so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-10-wdf11-integration-with-network-topics/solution"
				},
				{
					title: "Integration with Network Topics supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF11 Integration with Network Topics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-23-wdf11-integration-with-network-topics-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-23-wdf11-integration-with-network-topics-supplement/solution"
				},
				{
					title: "Integration with Network Topics supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF11 Integration with Network Topics. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-24-wdf11-integration-with-network-topics-supplement/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-24-wdf11-integration-with-network-topics-supplement/solution"
				}
			]
		},
		{
			title: "WDF12 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "Docker and Containers",
					content:
						"Offer Docker and containers as a follow-on topic once students understand project boundaries, servers, and deployment. Containers make more sense when students already know why reproducible environments, service boundaries, and startup configuration matter."
				},
				{
					title: "CI/CD with GitHub Actions",
					content:
						"Introduce CI/CD as the automation layer that can lint, test, build, and deploy projects after the manual workflow is already clear. Students should see CI/CD as a codified version of their development and deployment discipline, not as a shortcut that replaces understanding."
				},
				{
					title: "Postgres as a SQL Companion Track",
					content:
						"Recommend Postgres as the natural SQL companion once students understand data modeling and the SQL-vs-NoSQL decision. This gives the broader web path a clean way to deepen relational thinking without undoing the value of earlier MongoDB work."
				},
				{
					title: "Object Storage and CDN Delivery",
					content:
						"Add S3-style object storage and CDN delivery as a forward-looking topic that connects assets, performance, caching, and global delivery. This helps students see that front-end files, uploaded media, and performance strategy often involve storage and delivery systems beyond the app server itself."
				},
				{
					title: "WDF12 Expansion Ideas and Next Steps: Core Project",
					content:
						"Use this module build as the main implementation checkpoint. Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Workflow Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a running notebook for expansion ideas and next steps that records the commands, editor setup, files changed, deployment assumptions, and debugging decisions made in that part of the course. Focus especially on which advanced path fits best after foundations and why so students build habits that carry from local work into real hosting and operations.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-11-wdf12-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF12 Expansion Ideas and Next Steps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-25-wdf12-expansion-ideas-and-next-steps-supplementa/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-25-wdf12-expansion-ideas-and-next-steps-supplementa/solution"
				},
				{
					title: "Expansion Ideas and Next Steps supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to WDF12 Expansion Ideas and Next Steps. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-26-wdf12-expansion-ideas-and-next-steps-supplementa/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-26-wdf12-expansion-ideas-and-next-steps-supplementa/solution"
				}
			]
		},
		{
			title: "Applied Studio 14: full stack web lab 14",
			curriculum: [
				{
					title: "full stack web lab 14: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: full stack web lab 14, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "full stack web lab 14: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: full stack web lab 14, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "full stack web lab 14: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: full stack web lab 14. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/solution"
				},
				{
					title: "full stack web lab 14: Review and Reflection",
					content:
						"Close Applied Studio 14: full stack web lab 14 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "full stack web lab 14: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: full stack web lab 14 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-01-full-stack-web-lab-14/solution"
				},
				{
					title: "Applied Studio 14: full stack web lab 14 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: full stack web lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-27-applied-studio-14-full-stack-web-lab-14-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-27-applied-studio-14-full-stack-web-lab-14-suppleme/solution"
				},
				{
					title: "Applied Studio 14: full stack web lab 14 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 14: full stack web lab 14. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-28-applied-studio-14-full-stack-web-lab-14-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-28-applied-studio-14-full-stack-web-lab-14-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 15: full stack web lab 15",
			curriculum: [
				{
					title: "full stack web lab 15: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: full stack web lab 15, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "full stack web lab 15: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: full stack web lab 15, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "full stack web lab 15: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: full stack web lab 15. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/solution"
				},
				{
					title: "full stack web lab 15: Review and Reflection",
					content:
						"Close Applied Studio 15: full stack web lab 15 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "full stack web lab 15: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: full stack web lab 15 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-02-full-stack-web-lab-15/solution"
				},
				{
					title: "Applied Studio 15: full stack web lab 15 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: full stack web lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-29-applied-studio-15-full-stack-web-lab-15-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-29-applied-studio-15-full-stack-web-lab-15-suppleme/solution"
				},
				{
					title: "Applied Studio 15: full stack web lab 15 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 15: full stack web lab 15. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-30-applied-studio-15-full-stack-web-lab-15-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-30-applied-studio-15-full-stack-web-lab-15-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 16: full stack web lab 16",
			curriculum: [
				{
					title: "full stack web lab 16: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: full stack web lab 16, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "full stack web lab 16: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: full stack web lab 16, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "full stack web lab 16: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: full stack web lab 16. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/solution"
				},
				{
					title: "full stack web lab 16: Review and Reflection",
					content:
						"Close Applied Studio 16: full stack web lab 16 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "full stack web lab 16: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: full stack web lab 16 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-03-full-stack-web-lab-16/solution"
				},
				{
					title: "Applied Studio 16: full stack web lab 16 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: full stack web lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-31-applied-studio-16-full-stack-web-lab-16-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-31-applied-studio-16-full-stack-web-lab-16-suppleme/solution"
				},
				{
					title: "Applied Studio 16: full stack web lab 16 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 16: full stack web lab 16. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-32-applied-studio-16-full-stack-web-lab-16-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-32-applied-studio-16-full-stack-web-lab-16-suppleme/solution"
				}
			]
		},
		{
			title: "Applied Studio 17: full stack web lab 17",
			curriculum: [
				{
					title: "full stack web lab 17: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: full stack web lab 17, define the success criteria, and review the concepts students must understand before they begin the main build or problem."
				},
				{
					title: "full stack web lab 17: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: full stack web lab 17, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "full stack web lab 17: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: full stack web lab 17. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/solution"
				},
				{
					title: "full stack web lab 17: Review and Reflection",
					content:
						"Close Applied Studio 17: full stack web lab 17 by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "full stack web lab 17: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: full stack web lab 17 with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-04-full-stack-web-lab-17/solution"
				},
				{
					title: "Applied Studio 17: full stack web lab 17 supplemental 2",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: full stack web lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-33-applied-studio-17-full-stack-web-lab-17-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-33-applied-studio-17-full-stack-web-lab-17-suppleme/solution"
				},
				{
					title: "Applied Studio 17: full stack web lab 17 supplemental 3",
					content:
						"Use the linked starter and solution for a supplemental project tied to Applied Studio 17: full stack web lab 17. Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version.",
					projectLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-34-applied-studio-17-full-stack-web-lab-17-suppleme/starter",
					solutionLink:
						"https://github.com/instruction-material/Web-Development-Foundations/tree/main/WDF-34-applied-studio-17-full-stack-web-lab-17-suppleme/solution"
				}
			]
		}
	]
};
