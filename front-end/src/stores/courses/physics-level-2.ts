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
					title: "Common Pitfalls",
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
						"Readiness check: identify all external forces before solving and state whether the system is accelerating along each chosen axis. A short diagram checkpoint explains a scale reading without relying on intuition alone."
				},
				{
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
					title: "Common Pitfalls",
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
						"Accept projects such as a projectile planner, elevator-force simulation, pulley design, collision analysis, orbit model, or thermal design study. Each project includes a question, a model, a data source, a graph, and a short defense of the model's limits."
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
					title: "Common Pitfalls",
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
					title: "Numerical Model Concepts",
					content:
						"Numerical modeling turns a physics relationship into repeated update rules. Track the state variables, choose a time step, calculate the next state, and compare the result with a conservation check or known limiting case. The main question is not whether the computer produced numbers; it is whether the step size, assumptions, and validation evidence make those numbers physically defensible."
				},
				{
					title: "Simulation Reasoning Toolkit",
					content:
						"Start each simulation by naming the system, stored quantities, update equation, units, and stopping condition. Use a very small test case before trusting a longer run: constant velocity should stay linear, free fall should curve predictably, and total energy should only drift for a known reason. Record both the graph and one numerical check so errors in the loop, signs, or time step are visible."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from projectile motion with drag, iterative motion updates, and simulation-versus-ideal comparisons. For each example, show the update rule, a small table or graph, the first few calculated steps, and the validation check that makes the output credible."
				},
				{
					title: "Time-Step Data Exercise",
					content:
						"Run the same model with at least two time-step sizes and graph the results together. Look for divergence, artificial energy gain or loss, and places where a smooth path becomes jagged. The written conclusion should explain whether the model is stable enough for the question being asked, not simply which graph looks better."
				},
				{
					title: "Simulation Case Study",
					content:
						"Use a browser simulation, spreadsheet, or short Python notebook to model projectile drag, repeated acceleration updates, orbit-like motion, or another iterative system. Keep the case study remote-safe and evidence-based: include the update rule, sample rows or graph output, one validation check, and one reason the ideal model and corrected model differ."
				},
				{
					title: "Transfer Practice: Model Stability",
					content:
						"Transfer the simulation pattern to a new physical system by identifying which variables still update step by step and which assumptions change. A strong response names the most fragile assumption, explains how smaller steps or better data would test it, and distinguishes a numerical artifact from a real physical effect."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the update rule, time step, initial conditions, and validation target are stated before a simulation run is trusted. A strong checkpoint explains one conservation or limiting-case test that would catch a broken numerical model."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include trusting a long simulation without a small sanity test, choosing a time step that creates artificial behavior, and treating graph smoothness as proof that the physics is correct."
				},
				{
					title: "Extension Project: Motion Model Comparison",
					content:
						"Compare an ideal motion model with a corrected model for drag, friction, nonconstant acceleration, or measurement noise. Include both graphs, explain what changed physically, and state which model is useful for prediction versus explanation."
				}
			]
		},
		{
			title: "PHY18 Experimental Uncertainty and Curve Fitting",
			curriculum: [
				{
					title: "Uncertainty and Fit Concepts",
					content:
						"Experimental uncertainty is part of the evidence, not a decoration added after the answer. Distinguish precision from accuracy, random scatter from systematic bias, and a good-looking trend from a justified model. Residuals, slope meaning, units, and fit quality all help decide what the data actually supports."
				},
				{
					title: "Data Quality Toolkit",
					content:
						"Before fitting a curve, define the measured quantities, units, instrument resolution, expected relationship, and possible bias source. Then inspect the data visually before calculating. A fitted line or curve needs a physical interpretation: the slope, intercept, residual pattern, and outliers should all be explained in context."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from position-time, velocity-time, force-extension, current-voltage, and transformed-variable graphs. For each example, identify the measured variables, graph shape, fitted relationship, residual behavior, and physical meaning of the slope or intercept."
				},
				{
					title: "Residuals and Slope Exercise",
					content:
						"Create a graph with labeled axes, a fitted relationship, and a residual check. Explain what the slope means physically, whether the intercept is meaningful or just a fitting artifact, and whether the residuals show random scatter or a pattern that the model missed."
				},
				{
					title: "Measurement Case Study",
					content:
						"Use provided data, a simulation export, a video measurement, or a spreadsheet dataset to make a claim with uncertainty attached. The final explanation includes the fitted model, the evidence for trusting or rejecting it, and one additional measurement that would most improve the conclusion."
				},
				{
					title: "Transfer Practice: Evidence Strength",
					content:
						"Apply the same uncertainty reasoning to a new dataset. State what the graph can prove, what it cannot prove, and how the conclusion changes if a suspected bias is real. The emphasis is on defensible evidence rather than producing a single polished equation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the measurement units, precision, suspected bias, fit type, and residual pattern are named before drawing a conclusion. A strong checkpoint explains what the slope means and whether the data actually supports that model."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include reporting too many digits, ignoring systematic bias because the graph looks linear, treating correlation as a physics law, and skipping residuals that would reveal a poor fit."
				},
				{
					title: "Extension Project: Measurement Audit",
					content:
						"Audit a measurement set by identifying precision, possible systematic bias, residuals, and the meaning of the fitted slope or trend. Revise the conclusion so it names what the data supports, what remains uncertain, and what additional measurement would help most."
				}
			]
		},
		{
			title: "PHY19 Coupled Systems and Constraints",
			curriculum: [
				{
					title: "Constraint Concepts",
					content:
						"Coupled systems require reasoning about relationships between objects before solving equations. Shared acceleration, fixed string length, tension assumptions, rods, pulleys, and contact constraints all restrict what motion is possible. The model succeeds when the diagram, constraint statement, and algebra describe the same physical linkage."
				},
				{
					title: "Constraint Reasoning Toolkit",
					content:
						"Name each object, force, idealization, and shared variable before writing equations. Then write the constraint in words and symbols: equal accelerations, opposite directions, fixed distance, rolling without slipping, or another relationship. Check that every equation follows from a diagram feature rather than from a memorized setup."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pulleys, elevators, linked carts, friction pairs, rods, strings, and mechanical linkages. For each example, draw the connected objects, state the constraint in words, translate it into equations, and check whether the assumed linkage is physically plausible."
				},
				{
					title: "Constraint Diagram Exercise",
					content:
						"Draw a diagram or table that separates object-level forces from system-level constraints. The representation shows which quantities are shared, which directions are linked, and which assumptions would fail if a string stretches, a pulley has mass, or contact is lost."
				},
				{
					title: "Coupled-System Case Study",
					content:
						"Use a remote-safe simulation, diagram set, or paper design case to analyze a connected system. The final explanation states the chosen system boundary, the constraint equation, the force model, and one realistic condition where the simplified constraint would stop working."
				},
				{
					title: "Transfer Practice: Changing Constraints",
					content:
						"Transfer the analysis to a related system with one changed constraint, such as a heavier pulley, slipping contact, elastic string, or added friction. Explain which equations survive, which must be rewritten, and what observation would reveal the change."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the system boundary, connected objects, shared variables, and idealized constraints are named before solving. A strong checkpoint explains why two accelerations, distances, or forces are linked rather than merely copying a pulley formula."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include assigning one tension value when the ideal-string assumption is not justified, mixing internal and external forces, and writing more equations without checking whether the constraints are independent."
				},
				{
					title: "Extension Project: Connected System Constraint Map",
					content:
						"Map a connected mechanical system such as linked carts, pulley masses, an elevator setup, or a hinged structure. Label the shared constraints, forces, assumed ideal parts, and one failure mode where the simplified constraint model would break."
				}
			]
		},
		{
			title: "PHY20 Fluids and Continuum Models",
			curriculum: [
				{
					title: "Continuum Model Concepts",
					content:
						"Fluid models treat many particles as a continuous material when the scale makes that approximation useful. Pressure, density, viscosity, flow rate, and boundary shape determine which model is reasonable. The important habit is naming when a continuum model is useful and when turbulence, compressibility, or material complexity makes it too simple."
				},
				{
					title: "Fluid Reasoning Toolkit",
					content:
						"Define the fluid region, inlet and outlet conditions, pressure or height difference, flow assumptions, and relevant material properties. Use diagrams to show where pressure changes, where speed changes, and where energy or mass conservation is being applied. Keep units visible because flow, pressure, and density errors often hide inside conversions."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from pipes, nozzles, blood vessels, ducts, weather, water slides, and simplified wing models. For each example, label the control volume or flow path, name the pressure and flow variables, and decide which assumptions make the simplified fluid model usable."
				},
				{
					title: "Pressure and Flow Exercise",
					content:
						"Represent a pipe, nozzle, duct, vessel, or flow path with a labeled diagram and a simple graph or table. The representation connects geometry to pressure, speed, or flow-rate changes and identifies where the model would be unreliable because of turbulence, leaks, changing viscosity, or poorly defined boundaries."
				},
				{
					title: "Fluid Case Study",
					content:
						"Use a simulation, provided data, video observation, or paper case such as a nozzle, wing analogy, blood-vessel model, water slide, or ventilation duct. The final explanation states the continuum assumption, the key variables, the evidence source, and one condition that would force a more detailed model."
				},
				{
					title: "Transfer Practice: Model Domain",
					content:
						"Transfer the fluid model to a new scale or material and decide whether the same assumptions still apply. A strong response compares what stays conserved with what changes because of viscosity, turbulence, compressibility, or boundary shape."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the fluid region, density or pressure variables, flow assumptions, and model limits are stated before calculation. A strong checkpoint explains why a continuum model is acceptable for the case being analyzed."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include using a pipe-flow formula outside its assumptions, ignoring viscosity or turbulence, mixing pressure and force units, and treating density as constant when the situation does not justify it."
				},
				{
					title: "Extension Project: Fluid System Case Study",
					content:
						"Analyze a fluid-system case such as a pipe, nozzle, duct, blood-vessel analogy, simplified wing, or water-slide segment. Identify the continuum assumption, flow or pressure variables, evidence source, and one reason the model may not transfer to a turbulent or real-material case."
				}
			]
		},
		{
			title: "PHY21 Thermodynamics and Engines",
			curriculum: [
				{
					title: "Thermal System Concepts",
					content:
						"Thermodynamics tracks energy as heat, work, and internal energy across a defined system boundary. The first law is an accounting rule, but the physical interpretation depends on sign convention, process path, useful output, and irreversibility. Engines, refrigerators, and heat pumps make the bookkeeping concrete."
				},
				{
					title: "Energy Accounting Toolkit",
					content:
						"Begin with a system boundary and an energy-flow diagram. Label heat entering or leaving, work done by or on the system, internal-energy change, and the process being approximated. Only then calculate efficiency, coefficient of performance, or energy balance; otherwise the signs and useful-output claims become guesswork."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from engines, refrigerators, heat pumps, power plants, human bodies, and energy-flow diagrams. For each example, mark the system boundary, heat direction, work direction, internal-energy change, and useful-output definition before comparing efficiency or performance."
				},
				{
					title: "Energy Flow Exercise",
					content:
						"Create an energy-flow diagram, process table, or simplified PV-style sketch for an engine, refrigerator, heat pump, power plant, or biological energy-transfer example. The representation separates total energy accounting from useful output and names the loss or irreversible step."
				},
				{
					title: "Thermal Case Study",
					content:
						"Use a remote-safe simulation, provided data, product specification, or paper design case to compare heat, work, and efficiency. The final explanation states the energy claim, the evidence used, the chosen sign convention, and one reason a real device cannot reach the ideal limit."
				},
				{
					title: "Transfer Practice: Useful Energy",
					content:
						"Transfer the accounting method to a different thermal device and decide what counts as useful output. Explain how the conclusion changes when the goal is heating, cooling, mechanical work, or electrical generation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether heat, work, internal-energy change, system boundary, and useful output are labeled before efficiency is calculated. A strong checkpoint explains the sign convention and why an ideal limit is not the same as a real device."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating heat as stored energy, reversing work signs, claiming lost energy disappeared, and comparing engines or refrigerators without first defining the useful output."
				},
				{
					title: "Extension Project: Engine or Refrigerator Audit",
					content:
						"Audit an engine, refrigerator, heat pump, or power-plant cycle by defining useful output before calculating or comparing efficiency. Include an energy-flow diagram, identify heat and work directions, and explain one unavoidable loss or irreversibility."
				}
			]
		},
		{
			title: "PHY22 Electromagnetic Applications and Signals",
			curriculum: [
				{
					title: "Signal and Sensor Concepts",
					content:
						"Signals are changing physical quantities that become useful only after measurement, calibration, and interpretation. Sensors and transducers convert one kind of physical behavior into another, while noise and filtering shape what can be trusted. The physics question is how the signal relates to the real quantity, not just how to make a graph."
				},
				{
					title: "Signal Reasoning Toolkit",
					content:
						"Identify the measured quantity, transducer mechanism, sampling pattern, calibration method, noise source, and expected signal shape. Compare raw and processed data before drawing conclusions. A useful model states what the sensor can resolve, what it averages away, and what failure mode could produce a misleading signal."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from microphones, speakers, thermistors, accelerometers, RC-style filtering, and noisy time-series graphs. For each example, trace the physical quantity through the transducer, calibration step, signal graph, and interpretation limit."
				},
				{
					title: "Noisy Signal Exercise",
					content:
						"Plot a signal with noise, calibration points, or filtering applied. Explain which features represent the physical quantity and which are measurement artifacts. The exercise should compare at least two interpretations, such as raw peak value versus averaged trend or unfiltered noise versus smoothed signal."
				},
				{
					title: "Sensor Case Study",
					content:
						"Use a remote-safe data file, simulation, app sensor export, or device-spec case to analyze a signal. The final explanation states the physical quantity, transducer or measurement method, calibration evidence, noise treatment, and one test that would reveal whether the sensor is trustworthy."
				},
				{
					title: "Transfer Practice: Measurement Trust",
					content:
						"Transfer the signal model to a different sensor or physical quantity. Decide what changes about calibration, sampling, noise, and interpretation, then name the evidence needed before the measurement can support a claim."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the measured quantity, transducer, sampling method, calibration evidence, and noise source are identified before interpreting a signal. A strong checkpoint explains which part of the graph is physical and which part may be measurement artifact."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include smoothing away real events, mistaking noise for a signal, trusting an uncalibrated sensor, and forgetting that a transducer can distort the quantity it is supposed to reveal."
				},
				{
					title: "Extension Project: Sensor System Proposal",
					content:
						"Design a sensor-system proposal that names the physical quantity, transducer, calibration method, noise source, and filtering or averaging plan. Include a sample signal sketch and one test that would show whether the sensor is trustworthy."
				}
			]
		},
		{
			title: "PHY23 Relativity and Reference Frames Preview",
			curriculum: [
				{
					title: "Reference Frame Concepts",
					content:
						"Reference frames determine how position, velocity, time, and event order are described. Classical relative velocity works well at everyday speeds, but high-speed or high-precision cases require clearer domain limits and relativistic corrections. The aim is to see why a model can be accurate in one regime and incomplete in another."
				},
				{
					title: "Frame Reasoning Toolkit",
					content:
						"State the observer frame before writing a velocity, time, or distance claim. Use event diagrams, frame labels, and domain notes to prevent accidental mixing of perspectives. When a correction is needed, explain the condition that makes the classical model insufficient rather than treating relativity as a disconnected formula set."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from passenger-car-road frames, high-speed limits, GPS timing, particle examples, and event diagrams. For each example, label the observer frame, event order, classical expectation, correction trigger, and scale where the difference matters."
				},
				{
					title: "Event Diagram Exercise",
					content:
						"Represent a passenger-car-road problem, GPS timing example, particle scenario, or light-signal case with labeled frames and events. The diagram should make clear which observer describes each quantity and where the classical description remains adequate or begins to fail."
				},
				{
					title: "Relativity Case Study",
					content:
						"Use a safe simulation, provided article excerpt, GPS timing example, or particle-physics case to compare classical and frame-aware reasoning. The final explanation states the frame, the quantity being corrected, the evidence or scale that requires the correction, and one limitation of the simplified treatment."
				},
				{
					title: "Transfer Practice: Domain Limits",
					content:
						"Transfer the reference-frame reasoning to a new high-speed or high-precision example. State when the classical model is still useful, when it is not, and what scale of evidence would justify using a relativistic correction."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the observer frame, event labels, velocity claim, and domain limit are stated before applying a correction. A strong checkpoint explains why the classical frame description is adequate or why a relativistic preview is needed."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include mixing quantities from different frames, treating relativity as relevant at every everyday speed, and using a correction formula without naming the physical scale that makes the correction matter."
				},
				{
					title: "Extension Project: Relativity Explainer",
					content:
						"Create a relativity explainer that starts with the classical expectation, then shows why a frame-aware correction is needed. Use an event diagram, timing comparison, or GPS-style example and clearly mark the speed or precision conditions where the correction matters."
				}
			]
		},
		{
			title: "PHY24 Independent Physics Research Portfolio",
			curriculum: [
				{
					title: "Research Portfolio Concepts",
					content:
						"An independent physics portfolio begins with a focused question narrow enough to model and broad enough to matter. Source quality, model choice, evidence, limitations, and revision all shape the final claim. The final product shows how physics reasoning changed the question, not just collect facts about a topic."
				},
				{
					title: "Research Reasoning Toolkit",
					content:
						"Define the system, physical quantities, model type, evidence source, and expected relationship before collecting material. Use formulas, diagrams, or simulations only when they answer the research question directly. Keep a revision log that records why the claim narrowed, changed, or became better supported."
				},
				{
					title: "Worked Example Set",
					content:
						"Use examples from sports, rockets, music, climate, medicine, robotics, or electronics translated into physics questions. For each example, narrow the broad topic into a modelable question, identify the evidence source, and explain how the physics model supports or limits the claim."
				},
				{
					title: "Portfolio Evidence Exercise",
					content:
						"Create one graph, diagram sequence, calculation table, or source-comparison chart that carries real evidence for the portfolio. The representation makes a physical relationship visible and includes a note about uncertainty, model fit, or a limitation in the available source."
				},
				{
					title: "Independent Case Study",
					content:
						"Use a safe remote-friendly simulation, public dataset, article diagram, video observation, or paper design case tied to the chosen topic. The final explanation states the claim, evidence, model used, and one uncertainty or simplifying assumption that limits the conclusion."
				},
				{
					title: "Transfer Practice: Revising a Claim",
					content:
						"Finish by revising the portfolio claim after reviewing the evidence. State what became more precise, what remains uncertain, which assumption is most fragile, and what additional source or model would make the conclusion stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether the research question, source quality, physical quantities, model choice, and limitation are explicit before the portfolio is drafted. A strong checkpoint explains how the evidence narrows or revises the original claim."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include choosing a topic too broad to model, collecting interesting facts without a physics question, using an unvetted source as evidence, and hiding uncertainty instead of using it to improve the final claim."
				},
				{
					title: "Extension Project: Independent Physics Portfolio",
					content:
						"Build an independent physics portfolio with a focused question, chosen model, evidence source, graph or diagram, conclusion, and limitation. The final revision should show how the evidence changed the claim or narrowed the scope."
				}
			]
		}
	]
});
