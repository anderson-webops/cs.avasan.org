import type { RawCourse } from "./types";

export const physicsLevel2Course: RawCourse = {
	name: "Physics Level 2",
	modules: [
		{
			title: "PHY8 Quantitative Kinematics and Vector Modeling",
			curriculum: [
				{
					title: "Introductions, Tooling, and Data Workflow",
					content:
						"This course builds on Intro to Physics and assumes comfort with algebra, graph reading, and basic trigonometry. Refresh the modeling workflow: VS Code or PyCharm for optional Python notebooks, spreadsheets for quick data work, and browser tools like PhET and Desmos for visual reasoning. Explain that the course now expects more multi-step modeling, clearer assumptions, and stronger graph interpretation than the introductory sequence."
				},
				{
					title: "Concept Lesson: Functions, Vectors, and Coordinate Systems",
					content:
						"Treat position, velocity, and acceleration as functions that can be analyzed numerically, graphically, and geometrically. Reinforce vector direction, magnitude, and components, then explain how a well-chosen coordinate system can simplify a complicated problem dramatically. Build the habit of choosing axes before writing equations."
				},
				{
					title: "Worked Example Set: Relative Velocity and Projectile Motion",
					content:
						"Work a wind-and-aircraft example, a river-crossing example, and a projectile example where horizontal and vertical motion are separated cleanly. Use component form, not memorized shortcuts alone, so students understand where the equations come from. Connect the mathematics back to physical storylines such as rescue drones, kicked balls, or supply drops."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective 2D",
					content:
						"Extend the motion-graph strand by combining graph interpretation with vector reasoning. Compare horizontal and vertical component graphs, estimate turning points, and decide when acceleration changes only one part of the motion. Require them to justify each conclusion with slope, area, or vector language."
				},
				{
					title: "Mini Lab or Simulation: Ballistics Model Comparison",
					content:
						"Compare a projectile prediction from equations with data from video, a simulator, or a spreadsheet model. Decide which assumptions are reasonable, where drag starts to matter, and why a model can still be useful when it is not perfect."
				},
				{
					title: "Reflection Question: When Do Components Clarify a Problem?",
					content:
						"Explain one motion problem that looked complex until it was decomposed into perpendicular components. They should identify exactly which quantity became easier to reason about after the coordinate system was chosen."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: resolve vectors accurately, label angles consistently, and explain why horizontal and vertical equations can be solved separately in projectile motion. Prompt: choose axes and defend the choice before calculating."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think the horizontal motion somehow 'runs out' at the top of a projectile, or that vectors can be added by simply adding magnitudes. Another common issue is treating sign mistakes as minor when they actually signal a broken coordinate setup."
				},
				{
					title: "Extension Project: Rescue Drone Navigation",
					content:
						"Plan a drone route that must compensate for wind or current. Use components, displacement vectors, and a short written explanation to compare intended motion with actual motion."
				}
			]
		},
		{
			title: "PHY9 Multi-Force Systems and Equilibrium",
			curriculum: [
				{
					title: "Concept Lesson: Net Force in Real Systems",
					content:
						"Move beyond single-force examples and treat forces as vectors that can combine, oppose, or redirect motion. Emphasize equilibrium, acceleration, and the importance of isolating one object at a time in multi-object systems. Keep free-body diagrams central instead of treating them as a warm-up step."
				},
				{
					title: "Worked Example Set: Elevators, Scales, and Connected Objects",
					content:
						"Work examples involving elevators, hanging masses, and platforms where the same object experiences multiple forces at once. Use Newton's laws to connect scale readings, normal force, and acceleration in a quantitative way. Highlight how the algebra stays manageable when the diagram is accurate."
				},
				{
					title: "Graph and Data Exercise: Force Sensor or Spreadsheet Trends",
					content:
						"Use measured or simulated data that compares net force, mass, and acceleration across several trials. Graph the relationships, interpret slopes, and explain which variables were controlled and which were changed. Use the results to reinforce that acceleration is a system response, not an independent ingredient."
				},
				{
					title: "Mini Lab or Simulation: Elevator and Scale Force Study",
					content:
						"Model an elevator or amusement-ride scenario and compare actual weight with apparent weight. Predict when the scale reading exceeds, matches, or falls below true weight and justify each case with a net-force argument."
				},
				{
					title: "Reflection Question: What Does Equilibrium Really Mean?",
					content:
						"Explain why equilibrium is not the same thing as 'nothing is happening.' They should distinguish between static equilibrium and constant-velocity motion with zero net force."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify all external forces before solving and state whether the system is accelerating along each chosen axis. A short whiteboard checkpoint explains a scale reading without relying on intuition alone."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often mix up the force pair in Newton's third law with the set of forces on one object. They also commonly assume a larger scale reading means the object's mass changed."
				},
				{
					title: "Extension Project: Tug-of-War System Audit",
					content:
						"Analyze a tug-of-war setup by separating the rope, the teams, and the ground into distinct objects. Use the project to reinforce the difference between internal and external forces in a system."
				}
			]
		},
		{
			title: "PHY10 Friction, Inclines, and Connected Systems",
			curriculum: [
				{
					title: "Concept Lesson: Friction and Ramp Geometry",
					content:
						"Develop static and kinetic friction carefully and connect both to the normal force and the surfaces involved. Use inclined planes to make force components concrete and to show why geometry matters in mechanics. Add connected systems such as pulleys so students must coordinate several equations rather than solve only one object at a time."
				},
				{
					title: "Worked Example Set: Blocks, Ramps, and Pulleys",
					content:
						"Work through a block at rest on a ramp, a sliding crate with kinetic friction, and a simple connected-mass or pulley example. Choose axes along and perpendicular to the incline, then interpret each sign and term physically. Use the worked examples to normalize slow, organized setup."
				},
				{
					title: "Graph and Data Exercise: Acceleration Versus Angle",
					content:
						"Use simulation or spreadsheet data to compare how acceleration changes as ramp angle changes under different friction assumptions. Graph the results, identify thresholds where slipping begins, and discuss why the relationship is not captured by 'steeper always means simple linear growth.'"
				},
				{
					title: "Mini Lab or Simulation: Pulley or Incline Force Analyzer",
					content:
						"Build or simulate a pulley or incline system and compare the predicted acceleration with observed motion. Keep a force summary, a diagram, and a short note about how friction or mass mismatch changes the result."
				},
				{
					title: "Reflection Question: Which Assumption Matters Most Here?",
					content:
						"Identify the single assumption that most strongly shapes the answer in an incline or pulley problem. Examples include neglecting pulley mass, assuming constant friction, or choosing the positive direction poorly."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: decide when static friction should be compared against a maximum value and when kinetic friction is the better model. A strong checkpoint explains why the normal force is not always equal to weight."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often assume friction always equals mu times N, even in static situations where it only adjusts up to a maximum. They also commonly project the full weight down the ramp instead of resolving gravity into components."
				},
				{
					title: "Extension Project: Ramp Design Challenge",
					content:
						"Design a ramp that either keeps an object stationary or produces a chosen acceleration. Defend the design with a free-body diagram, trig-based components, and a short engineering-style justification."
				}
			]
		},
		{
			title: "PHY11 Momentum, Impulse, and Collisions",
			curriculum: [
				{
					title: "Concept Lesson: Momentum as a Conserved Quantity",
					content:
						"Introduce momentum as a vector quantity that is often more useful than force alone when analyzing short interactions. Define impulse as force applied over time and connect it to the change in momentum. Use collisions to show how conservation laws organize messy events into a solvable structure."
				},
				{
					title: "Worked Example Set: Recoil, Bounces, and Crash Carts",
					content:
						"Work examples involving elastic and inelastic collisions, recoil, and impulse comparisons. Define the system first and then state whether external impulses are negligible. Keep the emphasis on sign, direction, and physical interpretation."
				},
				{
					title: "Graph and Data Exercise: Force-Time and Momentum Accounting",
					content:
						"Use force-time graphs or collision data tables to estimate impulse from area under the curve. Compare the momentum before and after several collision cases and discuss which differences come from measurement error versus genuine modeling limits."
				},
				{
					title: "Mini Lab or Simulation: Collision Lab with Momentum Ledger",
					content:
						"Run a cart, marble, or digital collision investigation and keep a momentum accounting table. Record predictions, classify the collision type, and explain why momentum and kinetic energy do not always behave the same way."
				},
				{
					title: "Reflection Question: Why Is System Choice So Important?",
					content:
						"Explain how the same event looks different when the chosen system changes. They should use the words momentum, external force, and impulse correctly in the response."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish momentum conservation from kinetic-energy conservation and interpret the sign of momentum consistently. Prompt: decide whether a force-time graph indicates a large force for a short time or a smaller force for a longer time."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think momentum is conserved only when objects bounce apart, or that heavier objects always 'win' a collision regardless of velocity. They also sometimes confuse impulse with impact duration alone."
				},
				{
					title: "Extension Project: Safety System Design Review",
					content:
						"Compare helmets, airbags, or crumple zones through the impulse idea. Explain how changing impact time can reduce force without claiming momentum disappears."
				}
			]
		},
		{
			title: "PHY12 Rotational Motion and Torque",
			curriculum: [
				{
					title: "Concept Lesson: Angular Quantities and Torque",
					content:
						"Extend mechanics from straight-line motion to rotation by introducing angular displacement, angular velocity, angular acceleration, and torque. Use levers, doors, wrenches, and balance points to make the ideas physical before formalizing them. Emphasize that where a force acts matters just as much as how large it is."
				},
				{
					title: "Worked Example Set: Lever Arms and Rotational Equilibrium",
					content:
						"Work several torque-balance problems involving seesaws, meter sticks, hanging masses, and tools. Compare a force applied close to the pivot with the same force applied farther away, and explain the difference with moment arm language. Use sign conventions carefully so rotational direction becomes part of the reasoning."
				},
				{
					title: "Graph and Data Exercise: Torque Versus Distance from Pivot",
					content:
						"Build or interpret a simple dataset that changes lever arm length while keeping force fixed. Graph torque versus distance, explain the trend, and discuss when the relationship may deviate because of measurement limits or setup geometry."
				},
				{
					title: "Mini Lab or Simulation: Balance and Door-Handle Investigation",
					content:
						"Use a meter stick balance, weighted ruler, or door-handle test to compare rotational effectiveness at different distances from the pivot. Connect physical effort to torque rather than claiming one side is simply 'heavier' in every case."
				},
				{
					title: "Reflection Question: How Is Rotation Like Translation, and How Is It Different?",
					content:
						"Map force to torque, mass to rotational inertia qualitatively, and linear acceleration to angular acceleration. The goal is not perfect formalism but deeper structural comparison."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify the pivot, choose a sign convention, and explain why a large force near the pivot may be less effective than a smaller force farther away. A quick prompt about opening a heavy door works well here."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think only force magnitude matters and ignore the location of the force. They may also confuse clockwise versus counterclockwise sign choices with right versus wrong answers rather than conventions."
				},
				{
					title: "Extension Project: Torque Design Challenge",
					content:
						"Design a lifting or balancing tool using lever-arm reasoning. Explain where the pivot should go, where the effort force should be applied, and what tradeoffs the design introduces."
				}
			]
		},
		{
			title: "PHY13 Gravitation, Circular Motion, and Orbits",
			curriculum: [
				{
					title: "Concept Lesson: Universal Gravitation and Inward Acceleration",
					content:
						"Develop gravity as a universal interaction between masses rather than only as a local downward pull. Pair that idea with circular motion so students can see how an inward net force changes direction continuously even when speed stays constant. This module should feel like a bridge from terrestrial mechanics to space applications."
				},
				{
					title: "Worked Example Set: Loops, Satellites, and Orbital Speed",
					content:
						"Work a loop-the-loop force comparison, a satellite-in-orbit speed problem, and a mass-distance gravity comparison. Explain how gravitational force can supply the centripetal force without introducing a second mysterious force. Use diagrams to keep the inward direction visible at every point."
				},
				{
					title: "Graph and Data Exercise: Radius, Period, and Inverse-Square Trends",
					content:
						"Compare how orbital radius changes period, speed, and gravitational force using tables, plots, or simulation output. Include an inverse-square comparison so the distance effect in gravity problems is visible before exact values are computed."
				},
				{
					title: "Mini Lab or Simulation: Simple Orbit Simulator in Python or Spreadsheet",
					content:
						"Build a basic orbit model with a spreadsheet, Desmos, or simple Python code that updates position and velocity qualitatively. Compare a low-orbit and high-orbit case and explain what changes in period, speed, and curvature."
				},
				{
					title: "Reflection Question: Why Doesn't an Orbiting Object 'Run Out of Gravity'?",
					content:
						"Explain why astronauts feel weightless in orbit even though gravity is still present. They should connect free fall, orbital motion, and continuous inward acceleration in one coherent explanation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify the inward direction in circular motion and explain why constant speed does not imply zero acceleration. Prompt: compare gravity at Earth's surface with gravity in low orbit."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think a centrifugal force must be added automatically in every inertial-frame analysis, or that satellites orbit because gravity has become negligible. They also may confuse speed being constant with velocity being constant."
				},
				{
					title: "Extension Project: Orbit Planner",
					content:
						"Design a simple satellite mission comparison between two orbital radii. Explain which orbit is better for faster revisits, which is better for wider coverage, and what the tradeoffs are."
				}
			]
		},
		{
			title: "PHY14 Electricity, Circuits, and Fields",
			curriculum: [
				{
					title: "Concept Lesson: From Circuits to Fields",
					content:
						"Advance the electricity unit by connecting circuit reasoning to electric field and potential ideas. Review current, voltage, and resistance, then extend to equivalent resistance, junction reasoning, and how potential difference drives charge motion. Keep the physics grounded in practical circuits while showing the deeper conceptual layer behind them."
				},
				{
					title: "Worked Example Set: Series-Parallel Analysis and Potential Drops",
					content:
						"Work several circuits with mixed branches, equivalent resistance, and qualitative current comparisons. Use simple energy and potential language so students see voltage as more than a number on a meter. Include one troubleshooting example where the circuit behavior reveals the hidden structure."
				},
				{
					title: "Graph and Data Exercise: I-V Curves and Circuit Tables",
					content:
						"Collect or interpret current-voltage data for resistive elements and compare linear versus non-linear behavior qualitatively. Build a clean circuit table listing current, potential difference, and resistance for each branch or component in a mixed circuit."
				},
				{
					title: "Mini Lab or Simulation: Series-Parallel Circuit Build",
					content:
						"Build or simulate a series-parallel circuit and compare predictions with measured or observed results. Keep a circuit diagram, note where potential drops occur, and explain how current splits or recombines at junctions."
				},
				{
					title: "Reflection Question: What Does Voltage Explain Better Than Current Alone?",
					content:
						"Explain one circuit behavior that becomes clearer once potential difference is considered explicitly. They should avoid the shortcut claim that voltage is just 'electricity strength.'"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: compare branch current and branch voltage correctly in series and parallel settings. A useful checkpoint predicts what changes everywhere in the circuit when one resistor is increased."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think the battery provides a fixed current regardless of circuit structure, or that voltage is used up the same way current is imagined to be used up. They may also overgeneralize rules from pure series circuits to every mixed circuit."
				},
				{
					title: "Extension Project: Circuit Design Audit",
					content:
						"Design a circuit that achieves a target brightness or resistance pattern, then justify the design in schematic and verbal form. Include at least one branch and one design tradeoff."
				}
			]
		},
		{
			title: "PHY15 Thermal Physics, Optics, and Modern Bridges",
			curriculum: [
				{
					title: "Concept Lesson: Heat Transfer and Model Boundaries",
					content:
						"Introduce temperature, internal energy, specific heat, and the three main heat-transfer pathways: conduction, convection, and radiation. Then bridge to optics and early modern-physics ideas by showing how models can shift when wave behavior, energy quantization, or light-matter interaction becomes important. This module is intentionally a bridge module: it broadens the student's map of physics without requiring a full advanced course in each topic."
				},
				{
					title: "Worked Example Set: Heating Curves, Lenses, and Threshold Ideas",
					content:
						"Work one heat-transfer comparison, one heating-curve interpretation, and one simple mirror or lens reasoning problem. Close with a modern-physics bridge discussion such as why light color alone can matter in photoelectric-style threshold reasoning, even when brightness changes too. Keep the emphasis on interpretation and model choice rather than advanced derivations."
				},
				{
					title: "Graph and Data Exercise: Heating Curves and Image Trends",
					content:
						"Interpret a heating curve to identify temperature changes versus phase-change plateaus, then compare that skill to reading an optics graph or image-distance table. Describe what the graph means physically, not just to label segments."
				},
				{
					title: "Mini Lab or Simulation: Insulation Test or Lens Investigation",
					content:
						"Run a small thermal or optics investigation, such as comparing insulation materials, tracing heat loss, or exploring image formation with simple lenses or mirrors. Define what counts as evidence and note where the simplified classroom model begins to break down."
				},
				{
					title: "Reflection Question: When Does a Model Need to Change?",
					content:
						"Describe one topic in the course where an earlier simple model was helpful and one place where a more refined model was needed later. This helps bridge introductory and modern viewpoints without losing coherence."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish heat from temperature, identify the dominant heat-transfer pathway in a scenario, and interpret a heating curve in words. If optics is included, the checkpoint should explain what a lens is doing to rays rather than merely naming the lens type."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often use heat and temperature interchangeably, or assume shiny means automatically hotter or colder without mechanism. In optics, they may think an image physically sits on a screen even when the setup is producing a virtual image."
				},
				{
					title: "Extension Project: Thermal Design Challenge",
					content:
						"Choose an everyday problem involving insulation, cooling, or light control and propose a design improvement. Support the proposal with one graph, one model, and one explicit limitation."
				}
			]
		},
		{
			title: "PHY16 Engineering Physics Capstone",
			curriculum: [
				{
					title: "Concept Lesson: Building a Defensible Physics Model",
					content:
						"Bring the course together by focusing on assumptions, approximations, uncertainty, and communication. Explain that a strong capstone does not need to be huge; it needs to be coherent, testable, and honest about limits. Encourage projects that combine at least two major themes, such as vectors with forces, collisions with momentum, or circuits with power and heat."
				},
				{
					title: "Worked Example Set: From Physical Situation to Model",
					content:
						"Walk through how to choose a system, state assumptions, define variables, and decide whether the right tool is forces, energy, momentum, torque, or a hybrid model. Include one example where the first chosen model is not the best one, and revise it."
				},
				{
					title: "Graph and Data Exercise: Prediction Versus Observation",
					content:
						"Compare an experimental or simulated dataset to a model prediction and Separate random error, systematic error, and model breakdown. Require a graph that makes the comparison visible rather than hiding it inside paragraphs."
				},
				{
					title: "Mini Lab or Simulation: Engineering Modeling Challenge",
					content:
						"Accept projects such as a projectile planner, elevator-force simulation, pulley design, collision analysis, orbit model, or thermal design study. Every project should include a question, a model, a data source, a graph, and a short defense of the model's limits."
				},
				{
					title: "Reflection Question: What Makes a Physics Answer Convincing?",
					content:
						"Explain how diagrams, equations, graphs, and plain-language reasoning support one another in a strong final explanation. They should describe one weakness in their own model and one improvement they would prioritize next."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: defend the system choice, assumptions, graph choice, and uncertainty treatment under follow-up questioning. A strong checkpoint explains what evidence would have changed the conclusion."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students may hide weak reasoning behind long calculations, or treat simulation output as automatically trustworthy because a computer produced it. They also may mistake complexity for rigor and avoid simpler, better-justified models."
				},
				{
					title: "Capstone Option: Physics Modeling Challenge",
					content:
						"Design a multi-step investigation or model that combines at least two major topics from the course. Present the final work with diagrams, calculations, graph evidence, stated assumptions, and a short engineering-style defense."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		},
		{
			title: "physics problem lab: Implementation Lab",
			curriculum: [
				{
					title: "physics problem lab: Core Concepts",
					content:
						"This lab states the target artifact, required behavior, and core concepts for the build or problem set."
				},
				{
					title: "physics problem lab: Guided Example",
					content:
						"A representative physics problem lab example names the key inputs, expected outputs, and checkpoints worth verifying early."
				},
				{
					title: "physics problem lab: Core Project",
					content:
						"Build one complete artifact first, then add one targeted improvement or edge-case pass."
				},
				{
					title: "physics problem lab: Review and Reflection",
					content:
						"Finish by reviewing the most important edge cases, naming one bug or limitation, and choosing one improvement for the next iteration."
				}
			],
			supplementalProjects: [
				{
					title: "physics problem lab: Extension Challenge",
					content:
						"Extend the core build with one extra requirement, stricter input handling, or a more realistic variation of the same task."
				},
				{
					title: "physics problem lab: Open Practice",
					content:
						"Create a compact variant inspired by physics problem lab: Implementation Lab. Keep the scope tight, but require one meaningful design or reasoning decision."
				},
				{
					title: "physics problem lab: Open-Ended Variant: Implementation Lab",
					content:
						"Create an original variation inspired by physics problem lab: Implementation Lab. Keep the scope small, but require one meaningful design or reasoning choice."
				}
			]
		}
	]
};
