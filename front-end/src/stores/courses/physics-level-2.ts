import type { RawCourse } from "./types";
import { contextualizePhysicsCourse } from "./physicsContentContext";

export const physicsLevel2Course: RawCourse = contextualizePhysicsCourse({
	name: "Physics Level 2",
	modules: [
		{
			title: "PHY8 Quantitative Kinematics and Vector Modeling",
			curriculum: [
				{
					title: "Introductions, Tooling, and Data Workflow",
					content:
						"This course builds on Intro to Physics and assumes comfort with algebra, graph reading, and basic trigonometry. The modeling workflow includes VS Code or PyCharm for optional Python notebooks, spreadsheets for quick data work, and browser tools like PhET and Desmos for visual reasoning. The course now expects more multi-step modeling, clearer assumptions, and stronger graph interpretation than the introductory sequence."
				},
				{
					title: "Functions, Vectors, and Coordinate Systems",
					content:
						"Treat position, velocity, and acceleration as functions that can be analyzed numerically, graphically, and geometrically. Reinforce vector direction, magnitude, and components, then explain how a well-chosen coordinate system can simplify a complicated problem dramatically. Build the habit of choosing axes before writing equations."
				},
				{
					title: "Worked Example Set: Relative Velocity and Projectile Motion",
					content:
						"Work a wind-and-aircraft example, a river-crossing example, and a projectile example where horizontal and vertical motion are separated cleanly. Use component form, not memorized shortcuts alone, so the source of each equation is clear. Connect the mathematics back to physical storylines such as rescue drones, kicked balls, or supply drops."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective 2D",
					content:
						"Extend the motion-graph strand by combining graph interpretation with vector reasoning. Compare horizontal and vertical component graphs, estimate turning points, and decide when acceleration changes only one part of the motion. Justify each conclusion with slope, area, or vector language."
				},
				{
					title: "Mini Lab or Simulation: Ballistics Model Comparison",
					content:
						"Compare a projectile prediction from equations with data from video, a simulator, or a spreadsheet model. Decide which assumptions are reasonable, where drag starts to matter, and why a model can still be useful when it is not perfect."
				},
				{
					title: "Reflection Question: When Do Components Clarify a Problem?",
					content:
						"Explain one motion problem that looked complex until it was decomposed into perpendicular components. A strong response identifies exactly which quantity became easier to reason about after the coordinate system was chosen."
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
						"Common pitfalls include treating horizontal motion as if it 'runs out' at the top of a projectile, adding vectors by simply adding magnitudes, and treating sign mistakes as minor when they actually signal a broken coordinate setup."
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
					title: "Net Force in Real Systems",
					content:
						"Forces are vectors that can combine, oppose, or redirect motion, so the course moves beyond single-force examples. Equilibrium, acceleration, and isolating one object at a time matter in multi-object systems. Free-body diagrams stay central instead of becoming a warm-up step."
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
						"Explain why equilibrium is not the same thing as 'nothing is happening.' A strong response distinguishes between static equilibrium and constant-velocity motion with zero net force."
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
						"Common pitfalls include mixing up the force pair in Newton's third law with the set of forces on one object, and assuming a larger scale reading means the object's mass changed."
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
					title: "Friction and Ramp Geometry",
					content:
						"Develop static and kinetic friction carefully and connect both to the normal force and the surfaces involved. Use inclined planes to make force components concrete and to show why geometry matters in mechanics. Add connected systems such as pulleys so the model coordinates several equations rather than solving only one object at a time."
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
						"Common pitfalls include assuming friction always equals mu times N even in static situations where it only adjusts up to a maximum, and projecting the full weight down the ramp instead of resolving gravity into components."
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
					title: "Momentum as a Conserved Quantity",
					content:
						"Momentum is a vector quantity that is often more useful than force alone when analyzing short interactions. Impulse is force applied over time and connects directly to the change in momentum. Collisions show how conservation laws organize messy events into a solvable structure."
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
						"Explain how the same event looks different when the chosen system changes. A strong response uses the words momentum, external force, and impulse correctly."
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
						"Common pitfalls include treating momentum as conserved only when objects bounce apart, assuming heavier objects always 'win' a collision regardless of velocity, and confusing impulse with impact duration alone."
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
					title: "Angular Quantities and Torque",
					content:
						"Mechanics extends from straight-line motion to rotation through angular displacement, angular velocity, angular acceleration, and torque. Levers, doors, wrenches, and balance points make the ideas physical before formalizing them. Where a force acts matters just as much as how large it is."
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
						"Common pitfalls include treating force magnitude as the only important factor, ignoring the location of the force, and confusing clockwise versus counterclockwise sign choices with right versus wrong answers rather than conventions."
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
					title: "Universal Gravitation and Inward Acceleration",
					content:
						"Develop gravity as a universal interaction between masses rather than only as a local downward pull. Pair that idea with circular motion so the inward net force explains continuous direction change even when speed stays constant. This module functions as a bridge from terrestrial mechanics to space applications."
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
						"Explain why astronauts feel weightless in orbit even though gravity is still present. A strong response connects free fall, orbital motion, and continuous inward acceleration in one coherent explanation."
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
						"Common pitfalls include adding centrifugal force automatically in every inertial-frame analysis, assuming satellites orbit because gravity has become negligible, and confusing constant speed with constant velocity."
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
					title: "From Circuits to Fields",
					content:
						"Advance the electricity unit by connecting circuit reasoning to electric field and potential ideas. Review current, voltage, and resistance, then extend to equivalent resistance, junction reasoning, and how potential difference drives charge motion. Keep the physics grounded in practical circuits while showing the deeper conceptual layer behind them."
				},
				{
					title: "Worked Example Set: Series-Parallel Analysis and Potential Drops",
					content:
						"Work several circuits with mixed branches, equivalent resistance, and qualitative current comparisons. Use simple energy and potential language so voltage is more than a number on a meter. Include one troubleshooting example where the circuit behavior reveals the hidden structure."
				},
				{
					title: "Graph and Data Exercise: I-V Curves and Circuit Tables",
					content:
						"Collect or interpret current-voltage data for resistive elements and compare linear versus non-linear behavior qualitatively. Build a clean circuit table listing current, potential difference, and resistance for each branch or component in a mixed circuit."
				},
				{
					title: "Mini Lab or Simulation: Series-Parallel Circuit Build",
					content:
						"Create or simulate a series-parallel circuit and compare predictions with measured or observed results. Keep a circuit diagram, note where potential drops occur, and explain how current splits or recombines at junctions."
				},
				{
					title: "Reflection Question: What Does Voltage Explain Better Than Current Alone?",
					content:
						"Explain one circuit behavior that becomes clearer once potential difference is considered explicitly. Avoid the shortcut claim that voltage is just 'electricity strength.'"
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
						"Common pitfalls include assuming the battery provides a fixed current regardless of circuit structure, treating voltage as if it is used up the same way current is imagined to be used up, and overgeneralizing pure-series rules to every mixed circuit."
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
					title: "Heat Transfer and Model Boundaries",
					content:
						"Temperature, internal energy, specific heat, and the three main heat-transfer pathways (conduction, convection, and radiation) anchor the module. The module then bridges to optics and early modern-physics ideas by showing how models can shift when wave behavior, energy quantization, or light-matter interaction becomes important. This is intentionally a bridge module: it broadens the physics map without requiring a full advanced course in each topic."
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
						"Readiness check: distinguish heat from temperature, identify the dominant heat-transfer pathway in a scenario, and interpret a heating curve in words. If optics is included, the checkpoint explains what a lens is doing to rays rather than merely naming the lens type."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Common pitfalls include using heat and temperature interchangeably, assuming shiny automatically means hotter or colder without a mechanism, and treating a virtual image as if it physically sits on a screen."
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
					title: "Building a Defensible Physics Model",
					content:
						"The capstone brings the course together through assumptions, approximations, uncertainty, and communication. A strong capstone does not need to be huge; it needs to be coherent, testable, and honest about limits. Prefer projects that combine at least two major themes, such as vectors with forces, collisions with momentum, or circuits with power and heat."
				},
				{
					title: "Worked Example Set: From Physical Situation to Model",
					content:
						"Model selection includes choosing a system, stating assumptions, defining variables, and deciding whether the right tool is forces, energy, momentum, torque, or a hybrid model. Include one example where the first chosen model is not the best one, then revise it."
				},
				{
					title: "Graph and Data Exercise: Prediction Versus Observation",
					content:
						"Compare an experimental or simulated dataset to a model prediction, then separate random error, systematic error, and model breakdown. Include a graph that makes the comparison visible rather than hiding it inside paragraphs."
				},
				{
					title: "Mini Lab or Simulation: Engineering Modeling Challenge",
					content:
						"Accept projects such as a projectile planner, elevator-force simulation, pulley design, collision analysis, orbit model, or thermal design study. Every project should include a question, a model, a data source, a graph, and a short defense of the model's limits."
				},
				{
					title: "Reflection Question: What Makes a Physics Answer Convincing?",
					content:
						"Explain how diagrams, equations, graphs, and plain-language reasoning support one another in a strong final explanation. Include one model weakness and one improvement that would matter most in a later revision."
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
						"Common pitfalls include hiding weak reasoning behind long calculations, treating simulation output as automatically trustworthy because a computer produced it, and mistaking complexity for rigor instead of choosing a simpler, better-justified model."
				},
				{
					title: "Capstone Option: Physics Modeling Challenge",
					content:
						"Design a multi-step investigation or model that combines at least two major topics from the course. Present the final work with diagrams, calculations, graph evidence, stated assumptions, and a short engineering-style defense."
				}
			]
		},
		{
			title: "PHY17 Numerical Modeling and Simulation Checks",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops step-based updates, time-step sensitivity, conservation checks, and model validation. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from projectile motion with drag, iterative motion updates, and simulation-versus-ideal comparisons. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: motion-model comparison with ideal and corrected graphs. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY18 Experimental Uncertainty and Curve Fitting",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops precision, systematic bias, residuals, slope meaning, and model fit quality. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from position-time, velocity-time, force-extension, current-voltage, and transformed-variable graphs. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: measurement audit with uncertainty and revised conclusion. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY19 Coupled Systems and Constraints",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops connected motion, shared acceleration, tension assumptions, and constraint equations. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pulleys, elevators, linked carts, friction pairs, rods, strings, and mechanical linkages. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: constraint map for a real connected mechanical system. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY20 Fluids and Continuum Models",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops continuum approximations, pressure, density, viscosity, flow rate, and model limits. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pipes, nozzles, blood vessels, ducts, weather, water slides, and simplified wing models. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: fluid-system case study with assumptions and limitation. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY21 Thermodynamics and Engines",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops heat, work, internal energy, first-law accounting, efficiency, and irreversibility. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from engines, refrigerators, heat pumps, power plants, human bodies, and energy-flow diagrams. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: engine or refrigerator audit with useful-output definition. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY22 Electromagnetic Applications and Signals",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops signals as changing physical quantities, sensors, transducers, noise, calibration, and filters. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from microphones, speakers, thermistors, accelerometers, RC-style filtering, and noisy time-series graphs. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: sensor-system proposal with calibration and noise plan. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY23 Relativity and Reference Frames Preview",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops reference frames, relative velocity, model domains, simultaneity previews, and practical time corrections. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from passenger-car-road frames, high-speed limits, GPS timing, particle examples, and event diagrams. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: relativity explainer that compares classical expectation with correction. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		},
		{
			title: "PHY24 Independent Physics Research Portfolio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"This module develops focused research questions, source quality, model choice, evidence, limitations, and revision. The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Build the model by first naming the system, quantities, assumptions, and expected direction of change. Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from sports, rockets, music, climate, medicine, robotics, or electronics translated into physics questions. Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Represent the module with at least one graph, diagram sequence, or data table. The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case. The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Finish the module by translating the model into a new situation. State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin. A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system. The correction should replace the shortcut with a specific advanced physics model."
				},
				{
					title: "Extension Project",
					content:
						"Complete an extension project: independent portfolio with question, model, evidence, graph, conclusion, and limitation. Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note."
				}
			]
		}
	]
});
