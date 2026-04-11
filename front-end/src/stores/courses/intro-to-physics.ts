import type { RawCourse } from "./types";

export const introToPhysicsCourse: RawCourse = {
	name: "Intro to Physics",
	modules: [
		{
			title: "PHY1 Measurement, Uncertainty, and Scientific Modeling",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"Start the course by setting up a light-weight physics workflow rather than a heavy programming stack. Use VS Code or PyCharm if Python modeling will be helpful later, but keep browser tools like PhET, Desmos, and spreadsheets ready because this course should stay highly visual and experimental. Create one physics folder for lab notes, exported graphs, photos, and short simulation writeups, and explain that no CMake or large software setup is required."
				},
				{
					title: "Concept Lesson: Measurement, Units, and Significant Figures",
					content:
						"Introduce physics as the practice of building models from measurements, not just memorizing formulas. Review SI units, prefixes, unit conversions, significant figures, and the difference between precision and accuracy. Frame uncertainty as part of honest scientific communication: every distance, time, and mass measurement has a useful range, not a magical exact value."
				},
				{
					title: "Worked Example Set: Estimation and Uncertainty",
					content:
						"Work through short examples that convert units, compare measured values, and round answers to appropriate precision. Include one estimate-first problem, such as predicting walking speed down a hallway before timing it, so students see that a rough model can still be valuable. Connect the examples to engineering habits: track assumptions, record units every line, and explain where the largest uncertainty comes from."
				},
				{
					title: "Graph and Data Exercise: Walking Trial Table",
					content:
						"Collect simple position-versus-time data from walking at different speeds across a room or hallway. Build a data table, choose axes carefully, graph the results, and interpret the slope as speed. Use this as the first full data-analysis strand: table to graph, graph to meaning, and meaning back to the original motion."
				},
				{
					title: "Mini Lab: Reaction-Time Ruler Drop",
					content:
						"Run a short ruler-drop lab to connect measurement with uncertainty and repeated trials. Students should predict how reaction time is inferred from distance fallen, collect several trials, compute an average, and discuss why repeated measurements matter more than one lucky attempt. Close by identifying controllable variables and sources of experimental error."
				},
				{
					title: "Reflection Question: What Makes Evidence Trustworthy?",
					content:
						"Ask students to explain when a small dataset is still useful, when more trials are needed, and how a graph can strengthen or weaken an argument. Require a short reflection that distinguishes between a bad experiment, a noisy experiment, and a careful experiment with honest uncertainty."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can convert units without losing meaning, label graphs with quantities and units, and explain why the same measured value can be both precise and inaccurate. Use one quick oral prompt: 'If two groups got slightly different walking speeds, does that automatically mean one group is wrong?'"
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for the idea that a graph is a picture of the path rather than a relationship between variables. Students also often assume more decimal places always mean better science, or that uncertainty means the experiment failed."
				},
				{
					title: "Extension Project: Measurement Scavenger Hunt",
					content:
						"Choose ten everyday objects or motions and decide which quantities could be measured directly and which would need to be calculated. Record the tools used, the likely uncertainty, and one reason each measurement might be difficult."
				}
			]
		},
		{
			title: "PHY2 Motion Graphs and Kinematics",
			curriculum: [
				{
					title: "Concept Lesson: Position, Velocity, and Acceleration",
					content:
						"Treat kinematics as the language of motion and make motion graphs a full strand rather than a quick side topic. Differentiate distance from displacement, speed from velocity, and velocity from acceleration, and use multiple examples where direction changes the interpretation. Connect verbal descriptions, diagrams, graphs, and equations so students see that all four are views of the same physical story."
				},
				{
					title: "Worked Example Set: Reading Motion Stories",
					content:
						"Use short scenarios such as a track sprinter, a marathon runner, and a tossed ball to translate between a story and a position-time or velocity-time graph. Work examples where the object speeds up, slows down, stops, reverses direction, or moves at constant velocity. Emphasize slope and area reasoning rather than formula-memorization alone."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective",
					content:
						"Give several graphs and ask students to reconstruct what the object was doing during each interval. Then reverse the task: provide a story and have students sketch a graph that matches it. Include one graph with a common trap, such as a flat line on a position graph, and require them to explain why it means 'stopped' rather than 'at zero speed forever.'"
				},
				{
					title: "Mini Lab: Phone-Camera Motion Analysis",
					content:
						"Use a phone camera to record a rolling cart, bouncing ball, or walking student and extract simple frame-by-frame position data. Build a table, estimate velocity over intervals, and compare the graph with the original video. This lab should explicitly bridge intuition and mathematics by showing that graphs come from real measurements, not just textbook drawings."
				},
				{
					title: "Simulation Challenge: Bouncy Ball Toss and Air Traffic Control",
					content:
						"Use one qualitative toss scenario and one wind-plus-plane scenario to compare one-dimensional motion with combined motion. Students should predict outcomes first, then test them with simulation or diagramming, and explain which part of the motion changes because of the extra velocity contribution."
				},
				{
					title: "Reflection Question: Which Representation Helped Most?",
					content:
						"Have students explain whether a diagram, graph, table, or equation was most helpful for one motion problem and why. Require them to name one place where they changed their mind after converting the same motion into a different representation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can move fluently between story, graph, and equation without being coached toward a specific formula. Use a short prompt where they must explain the sign of velocity and acceleration in words, not just symbols."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think the steepest graph point means the object is physically highest, or that crossing the time axis means the object disappears. Another common issue is confusing negative velocity with negative speed."
				},
				{
					title: "Extension Project: Track Star vs. Marathon Runner",
					content:
						"Compare two runners with different strategies by building distance-time and velocity-time graphs for each. Defend which runner is more efficient for a sprint versus an endurance event, and use graph evidence rather than only intuition."
				}
			]
		},
		{
			title: "PHY3 Forces, Free-Body Diagrams, and Newton's Laws",
			curriculum: [
				{
					title: "Concept Lesson: Forces as Interactions",
					content:
						"Introduce force as an interaction between objects rather than as a vague push that automatically causes motion. Develop Newton's laws with heavy emphasis on repeated free-body diagram practice, especially balanced versus unbalanced situations. Treat weight, normal force, tension, applied force, and friction as distinct ideas so later engineering problems stay organized."
				},
				{
					title: "Worked Example Set: Free-Body Diagram Repetition",
					content:
						"Work through a hanging object, a crate on a floor, an elevator rider, and a tug-of-war setup. Each example should require students to isolate one object at a time, label every external force, and connect the net force to the motion. Build repetition on purpose so the diagramming habit feels routine before the math gets harder."
				},
				{
					title: "Graph and Data Exercise: Net Force and Acceleration",
					content:
						"Use a small data table or simulation output showing how acceleration changes as net force changes for the same mass. Graph acceleration versus net force and interpret the trend in plain language. Then repeat with a larger mass so students can compare how the slope changes and what that says about inertia."
				},
				{
					title: "Mini Lab: Paper Bridge or Tower Force Analysis",
					content:
						"Build a simple paper bridge or tower, identify likely compression and tension regions, and predict failure points before testing. Use sketches and force arrows to explain why one design is stronger than another rather than treating the challenge as pure trial and error. This is the module's main engineering tie-in."
				},
				{
					title: "Simulation Challenge: Runaway Train and Elevator Forces",
					content:
						"Analyze a runaway-train stopping scenario qualitatively, then revisit the elevator problem with scale readings and apparent weight. Use both scenarios to reinforce that the same Newtonian ideas explain very different systems when the forces are identified clearly."
				},
				{
					title: "Reflection Question: When Does 'No Motion' Still Mean Forces Matter?",
					content:
						"Ask students to explain why a motionless object can still be a rich force-analysis problem. Require an answer that mentions balanced forces, not the incorrect claim that 'there are no forces because nothing is moving.'"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Use quick whiteboard checks where students must draw a complete free-body diagram from a single sentence prompt. Ask them to justify the direction of each force before any calculations happen."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often draw a 'force of motion' or confuse Newton's third-law pairs with forces acting on the same object. Another recurring issue is treating mass and weight as interchangeable."
				},
				{
					title: "Extension Project: Test of Strength",
					content:
						"Hold or suspend an object in static equilibrium, identify the forces, and explain why the object can feel heavy even when it is not accelerating. Use the setup to compare sensation, force, and motion carefully."
				}
			]
		},
		{
			title: "PHY4 Gravity, Work, and Energy",
			curriculum: [
				{
					title: "Concept Lesson: Gravity and Energy as a Unifying Theme",
					content:
						"Connect gravity to the broader idea of energy so mechanics feels like one coherent story rather than disconnected topics. Compare mass and weight, introduce gravitational potential and kinetic energy, and explain work as energy transfer. Frame energy as a bookkeeping tool that helps students organize many different motion situations."
				},
				{
					title: "Worked Example Set: Ball Drops, Ramps, and Pendulums",
					content:
						"Work through falling objects, ramp motion, and pendulum swings to show energy changing form while the total stays interpretable. Include at least one frictionless example and one real-world example where thermal energy matters. Push students to describe where the energy is, not just to plug numbers into formulas."
				},
				{
					title: "Graph and Data Exercise: Height-Speed and Energy Bar Charts",
					content:
						"Use tables or simulation data showing how speed changes with height on a ramp or track. Build energy bar charts alongside numeric data so students can see energy conservation visually and mathematically. Ask them to compare a no-friction graph with a rough-surface graph and explain the missing mechanical energy."
				},
				{
					title: "Mini Lab: Roller Coaster Energy Storyboard",
					content:
						"Create a storyboard for a roller coaster or skater run and label where gravitational potential, kinetic, and thermal energy are largest. Students should predict the speed ranking at different positions and justify their choices with energy reasoning rather than only with slope intuition."
				},
				{
					title: "Mini Lab: Galileo's Ball Drop Revisited",
					content:
						"Use a ball-drop comparison to revisit gravity with better measurement and cleaner reasoning than in the opening modules. Discuss what the experiment can actually show, what air resistance changes, and why the result supports the idea of common gravitational acceleration."
				},
				{
					title: "Reflection Question: Why Is Energy Such a Useful Idea?",
					content:
						"Ask students to compare solving a motion problem with forces versus with energy. They should explain one case where energy makes the structure of the problem clearer and one case where force analysis is still more natural."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can distinguish energy stored in a system from energy transferred into or out of it. Ask them to narrate an energy story in words before writing any equations. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often treat energy as something that gets 'used up' rather than transferred or transformed. They also commonly assume heavier objects fall faster simply because they have more weight."
				},
				{
					title: "Extension Project: Pendulum Design",
					content:
						"Design a pendulum demonstration and explain why it gradually loses amplitude in the real world. Suggest practical ways to reduce energy loss and predict which changes would matter most."
				}
			]
		},
		{
			title: "PHY5 Electricity and Basic Circuits",
			curriculum: [
				{
					title: "Concept Lesson: Charge, Current, Voltage, and Resistance",
					content:
						"Introduce electricity gently through practical circuits rather than abstract field theory first. Define charge, current, voltage, and resistance, and build the habit of describing what each quantity means physically. Use water-flow analogies carefully: helpful for intuition, but never a substitute for precise reasoning."
				},
				{
					title: "Worked Example Set: Series and Parallel Circuits",
					content:
						"Work small examples where students compare bulb brightness, current paths, and the effect of opening one branch. Use Ohm's law in simple numeric settings, but keep the focus on how the circuit behaves as a system. Include troubleshooting-style questions so they learn to reason from symptoms to structure."
				},
				{
					title: "Graph and Data Exercise: Current-Voltage Tables",
					content:
						"Collect or simulate several current-voltage data points for the same resistor or circuit element. Graph current versus voltage, interpret the slope qualitatively, and connect the pattern to resistance. Discuss why repeated measurements matter here too, especially when contacts or batteries are imperfect."
				},
				{
					title: "Mini Lab: Circuit Build and Measurement Log",
					content:
						"Build a simple series or parallel circuit and keep a careful measurement log. Record predicted versus observed bulb behavior, current direction, and any measured voltage or current values available from classroom tools. Require students to sketch the circuit before and after assembly."
				},
				{
					title: "Simulation Challenge: Circuit Debugging",
					content:
						"Use a simulator or drawn circuit set to diagnose why a bulb will not light, why one branch is dimmer, or why a switch placement matters. Treat debugging as a scientific reasoning task: identify the intended path, compare it to the actual path, and isolate the broken assumption."
				},
				{
					title: "Reflection Question: What Does a Diagram Hide or Reveal?",
					content:
						"Ask students to compare a physical breadboard or battery-and-bulb setup with its schematic diagram. They should explain which representation helps more with building, and which helps more with reasoning."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can predict what happens when one component is removed or replaced before they touch the hardware. A good checkpoint is having them explain current and voltage in the same circuit without mixing the two ideas."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think current gets 'used up' by the first bulb in a series circuit, or that a battery supplies a fixed current no matter the circuit. They also may confuse an open circuit with a weaker circuit rather than a broken path."
				},
				{
					title: "Extension Project: Home Device Power Survey",
					content:
						"Choose several household devices, estimate how electrical energy use differs among them, and connect those differences to power ratings and run time. This works well as a short bridge from circuits to practical energy use."
				}
			]
		},
		{
			title: "PHY6 Waves, Sound, and Light",
			curriculum: [
				{
					title: "Concept Lesson: Wave Behavior Across Media",
					content:
						"Introduce amplitude, wavelength, frequency, and wave speed through visual and auditory examples. Compare mechanical waves such as sound with electromagnetic waves such as light, while keeping the focus on shared wave ideas first. Use this module to make physics feel highly observable and pattern-based."
				},
				{
					title: "Worked Example Set: Pitch, Color, and Wave Speed",
					content:
						"Work examples that connect higher frequency with higher pitch, compare louder versus softer sounds through amplitude, and relate color differences to light frequency or wavelength. Include a simple wave-speed relationship problem and one example involving reflection or refraction."
				},
				{
					title: "Graph and Data Exercise: Reading Waveforms",
					content:
						"Interpret snapshots of waves and wave-versus-time graphs so students can read amplitude, period, and wavelength from more than one representation. If possible, compare a generated sound waveform with the sound students actually hear. Use the exercise to reinforce that graphs describe measurable quantities, not artistic shapes."
				},
				{
					title: "Mini Lab: Resonance and Sound Demo",
					content:
						"Run a resonance-focused demo using tuning forks, cups, strings, or a digital tone generator. Students should identify which variable is being changed, what happens near resonance, and how energy transfer becomes easier when frequencies match."
				},
				{
					title: "Simulation Challenge: Light, Reflection, and Refraction",
					content:
						"Use a ripple tank, mirror setup, or light simulation to compare reflection and refraction. Ask students to predict path changes first, then test the prediction and explain the result using wave ideas instead of only memorized rules."
				},
				{
					title: "Reflection Question: Why Are Waves So Good for Modeling Patterns?",
					content:
						"Have students explain how the same wave vocabulary helps describe music, water patterns, and light behavior. Require at least one comparison between a sound example and a light example."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can identify amplitude, frequency, and wavelength from both pictures and graphs. Use one short prompt that asks what changes when a sound gets louder versus when it gets higher in pitch."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often mix up amplitude with frequency, or assume waves always transport matter forward rather than mainly transporting energy. Another common issue is thinking light needs a medium in the same way sound does."
				},
				{
					title: "Extension Project: Sound Wave or Resonance Demo",
					content:
						"Design a demonstration that shows standing waves, resonance, or frequency changes clearly enough for another student to explain it back. Require a prediction, an observation, and a short explanation of what the wave model gets right."
				}
			]
		},
		{
			title: "PHY7 Capstone Lab and Scientific Communication",
			curriculum: [
				{
					title: "Concept Lesson: Designing a Fair Physics Investigation",
					content:
						"Bring the course together by revisiting scientific questions, variables, controls, uncertainty, and model limits. Explain that the capstone should combine conceptual understanding, graphing, experimental design, and clear communication rather than just producing a flashy result."
				},
				{
					title: "Worked Example Set: Turning a Question into a Testable Plan",
					content:
						"Work through how to refine a broad idea into a focused question, how to identify independent and dependent variables, and how to choose a useful graph before collecting data. Include one weak plan and one improved plan so students can see what makes an investigation manageable."
				},
				{
					title: "Graph and Data Exercise: Choosing the Best Representation",
					content:
						"Give a small capstone-style dataset and ask students to decide whether a line graph, scatterplot, bar chart, or energy storyboard communicates the result best. Require them to justify the choice in terms of the question being answered, not just visual preference."
				},
				{
					title: "Mini Lab: Grand Experiment Proposal",
					content:
						"Draft and revise the final experiment or modeling challenge before full execution. Accept options such as a motion study, energy audit, bridge-force analysis, simple circuit investigation, or resonance demo, as long as the question is narrow and the data plan is realistic."
				},
				{
					title: "Communication and Defense of Results",
					content:
						"Require a short report, slideshow, poster, or recorded explanation that includes the question, setup, graph or table, claim, and evidence. Students should also explain one limitation of their investigation and one improvement they would make with more time."
				},
				{
					title: "Reflection Question: How Has Your Physics Thinking Changed?",
					content:
						"Ask students to compare how they approached evidence, graphs, and models at the start of the course versus at the end. The goal is to make scientific growth visible, not just to review vocabulary."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can propose a question that is narrow enough to test, identify uncertainty honestly, and choose a graph that matches the data type. A strong checkpoint is asking them to predict in advance what result would count as evidence for or against their hypothesis."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students may think a lab is only successful if the hypothesis is confirmed, or that a polished presentation can replace weak evidence. They also sometimes jump to explanations before controlling variables."
				},
				{
					title: "Capstone Option: A Grand Experiment",
					content:
						"Design and carry out an original physics experiment or simulation-based investigation using one of the major course themes. Start with a focused question, justify the setup, collect repeatable evidence, and defend the conclusion with a graph or clearly labeled model."
				}
			]
		},
		{
			title: "Applied Studio 8: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 8: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 8: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 8: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 8: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 8: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 8: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 8: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 8: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 9: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 9: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 9: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 9: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 9: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 9: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 9: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 9: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 9: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 10: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 10: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 10: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 10: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 10: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 11: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 11: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 11: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 11: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 11: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 12: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 12: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 12: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 12: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 12: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 13: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 13: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 13: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 13: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 13: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 14: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 14: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 14: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 14: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 14: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 15: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 15: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 15: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 15: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 15: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 16: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 16: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 16: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 16: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 16: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 17: physics lab",
			curriculum: [
				{
					title: "physics lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: physics lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: physics lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: physics lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "physics lab: Review and Reflection",
					content:
						"Close Applied Studio 17: physics lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "physics lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: physics lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "physics lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 17: physics lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 17: physics lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 17: physics lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		}
	]
};
