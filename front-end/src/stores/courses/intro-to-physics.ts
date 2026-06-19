import type { RawCourse } from "./types";
import { contextualizePhysicsCourse } from "./physicsContentContext";

export const introToPhysicsCourse: RawCourse = contextualizePhysicsCourse({
	name: "Intro to Physics",
	modules: [
		{
			title: "PHY1 Measurement, Uncertainty, and Scientific Modeling",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"Start with a light-weight physics workflow rather than a heavy programming stack. Use VS Code or PyCharm if Python modeling will be helpful later, but keep browser tools like PhET, Desmos, and spreadsheets ready because the work stays highly visual and experimental. Create one physics folder for lab notes, exported graphs, photos, and short simulation writeups; no CMake or large software setup is required."
				},
				{
					title: "Measurement, Units, and Significant Figures",
					content:
						"Physics is the practice of building models from measurements, not just memorizing formulas. SI units, prefixes, unit conversions, significant figures, and the difference between precision and accuracy create the measurement foundation. Uncertainty is part of honest scientific communication: every distance, time, and mass measurement has a useful range, not a magical exact value."
				},
				{
					title: "Worked Example Set: Estimation and Uncertainty",
					content:
						"Work through short examples that convert units, compare measured values, and round answers to appropriate precision. Include one estimate-first problem, such as predicting walking speed down a hallway before timing it, so the value of a rough model is concrete. Connect the examples to engineering habits: track assumptions, record units every line, and explain where the largest uncertainty comes from."
				},
				{
					title: "Graph and Data Exercise: Walking Trial Table",
					content:
						"Use provided or safely observed position-versus-time data from walking at different speeds. Build a data table, choose axes carefully, graph the results, and interpret the slope as speed. This is the first full data-analysis strand: table to graph, graph to meaning, and meaning back to the original motion."
				},
				{
					title: "Mini Lab: Reaction-Time Ruler Drop",
					content:
						"Run a short ruler-drop lab to connect measurement with uncertainty and repeated trials. Predict how reaction time is inferred from distance fallen, collect several trials, compute an average, and discuss why repeated measurements matter more than one lucky attempt. Close by identifying controllable variables and sources of experimental error."
				},
				{
					title: "Reflection Question: What Makes Evidence Trustworthy?",
					content:
						"Explain when a small dataset is still useful, when more trials are needed, and how a graph can strengthen or weaken an argument. Include a short reflection that distinguishes between a bad experiment, a noisy experiment, and a careful experiment with honest uncertainty."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: convert units without losing meaning, label graphs with quantities and units, and explain why the same measured value can be both precise and inaccurate. Prompt: 'If two groups got slightly different walking speeds, does that automatically mean one group is wrong?'"
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating a graph as a picture of the path rather than a relationship between variables, assuming more decimal places always mean better science, and treating uncertainty as failed experimentation."
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
					title: "Position, Velocity, and Acceleration",
					content:
						"Treat kinematics as the language of motion and make motion graphs a full strand rather than a quick side topic. Differentiate distance from displacement, speed from velocity, and velocity from acceleration, and use multiple examples where direction changes the interpretation. Connect verbal descriptions, diagrams, graphs, and equations as four views of the same physical story."
				},
				{
					title: "Worked Example Set: Reading Motion Stories",
					content:
						"Short scenarios such as a track sprinter, a marathon runner, and a tossed ball support translation between a story and a position-time or velocity-time graph. Include objects speeding up, slowing down, stopping, reversing direction, or moving at constant velocity. Slope and area reasoning matter more than formula memorization alone."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective",
					content:
						"Use several graphs and reconstruct what the object was doing during each interval. Then reverse the task: provide a story and sketch a graph that matches it. Include one graph with a common trap, such as a flat line on a position graph, and explain why it means 'stopped' rather than 'at zero speed forever.'"
				},
				{
					title: "Mini Lab: Phone-Camera Motion Analysis",
					content:
						"Use a phone camera to record a rolling cart, bouncing ball, or walking person and extract simple frame-by-frame position data. Build a table, estimate velocity over intervals, and compare the graph with the original video. This lab should explicitly bridge intuition and mathematics by showing that graphs come from real measurements, not just textbook drawings."
				},
				{
					title: "Simulation Challenge: Bouncy Ball Toss and Air Traffic Control",
					content:
						"Use one qualitative toss scenario and one wind-plus-plane scenario to compare one-dimensional motion with combined motion. Predict outcomes first, then test them with simulation or diagramming, and explain which part of the motion changes because of the extra velocity contribution."
				},
				{
					title: "Reflection Question: Which Representation Helped Most?",
					content:
						"Explain whether a diagram, graph, table, or equation was most helpful for one motion problem and why. Name one place where the conclusion changed after converting the same motion into a different representation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: move fluently between story, graph, and equation without being coached toward a specific formula. Prompt: explain the sign of velocity and acceleration in words, not just symbols."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating the steepest graph point as the object's highest physical position, interpreting a time-axis crossing as the object disappearing, and confusing negative velocity with negative speed."
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
					title: "Forces as Interactions",
					content:
						"Force is an interaction between objects rather than a vague push that automatically causes motion. Newton's laws depend on repeated free-body diagram practice, especially balanced versus unbalanced situations. Weight, normal force, tension, applied force, and friction should stay distinct so later engineering problems stay organized."
				},
				{
					title: "Worked Example Set: Free-Body Diagram Repetition",
					content:
						"Work through a hanging object, a crate on a floor, an elevator rider, and a tug-of-war setup. For each example, isolate one object at a time, label every external force, and connect the net force to the motion. Build repetition on purpose so the diagramming habit feels routine before the math gets harder."
				},
				{
					title: "Graph and Data Exercise: Net Force and Acceleration",
					content:
						"Use a small data table or simulation output showing how acceleration changes as net force changes for the same mass. Graph acceleration versus net force and interpret the trend in plain language. Then repeat with a larger mass so the slope comparison reveals what inertia changes."
				},
				{
					title: "Mini Lab: Paper Bridge or Tower Force Analysis",
					content:
						"A simple paper bridge or tower can reveal compression, tension, and likely failure points before testing. Sketches and force arrows should explain why one design is stronger than another rather than treating the challenge as pure trial and error. This is the module's main engineering tie-in."
				},
				{
					title: "Simulation Challenge: Runaway Train and Elevator Forces",
					content:
						"Analyze a runaway-train stopping scenario qualitatively, then revisit the elevator problem with scale readings and apparent weight. Use both scenarios to reinforce that the same Newtonian ideas explain very different systems when the forces are identified clearly."
				},
				{
					title: "Reflection Question: When Does 'No Motion' Still Mean Forces Matter?",
					content:
						"Explain why a motionless object can still be a rich force-analysis problem. Include an answer that mentions balanced forces, not the incorrect claim that 'there are no forces because nothing is moving.'"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Use quick diagram checks that start from a single sentence prompt and produce a complete free-body diagram. Each force direction should be justified before any calculations happen."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include drawing a nonexistent 'force of motion,' confusing Newton's third-law pairs with forces acting on the same object, and treating mass and weight as interchangeable."
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
					title: "Gravity and Energy as a Unifying Theme",
					content:
						"Connect gravity to the broader idea of energy so mechanics feels like one coherent story rather than disconnected topics. Compare mass and weight, introduce gravitational potential and kinetic energy, and explain work as energy transfer. Frame energy as a bookkeeping tool for organizing many different motion situations."
				},
				{
					title: "Worked Example Set: Ball Drops, Ramps, and Pendulums",
					content:
						"Falling objects, ramp motion, and pendulum swings show energy changing form while the total stays interpretable. Include at least one frictionless example and one real-world example where thermal energy matters. The central habit is describing where the energy is, not just plugging numbers into formulas."
				},
				{
					title: "Graph and Data Exercise: Height-Speed and Energy Bar Charts",
					content:
						"Use tables or simulation data showing how speed changes with height on a ramp or track. Build energy bar charts alongside numeric data so energy conservation is visible both graphically and mathematically. Compare a no-friction graph with a rough-surface graph and explain the missing mechanical energy."
				},
				{
					title: "Mini Lab: Roller Coaster Energy Storyboard",
					content:
						"Create a storyboard for a roller coaster or skater run and label where gravitational potential, kinetic, and thermal energy are largest. Predict the speed ranking at different positions and justify their choices with energy reasoning rather than only with slope intuition."
				},
				{
					title: "Mini Lab: Galileo's Ball Drop Revisited",
					content:
						"A ball-drop comparison revisits gravity with better measurement and cleaner reasoning than in the opening modules. The analysis should separate what the experiment can actually show, what air resistance changes, and why the result supports the idea of common gravitational acceleration."
				},
				{
					title: "Reflection Question: Why Is Energy Such a Useful Idea?",
					content:
						"Compare solving a motion problem with forces versus with energy. A strong response explains one case where energy makes the structure of the problem clearer and one case where force analysis is still more natural."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish energy stored in a system from energy transferred into or out of it. Prompt: narrate an energy story in words before writing any equations."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating energy as something that gets 'used up' rather than transferred or transformed, and assuming heavier objects fall faster simply because they have more weight."
				},
				{
					title: "Extension Project: Pendulum Design",
					content:
						"Plan a pendulum demonstration and explain why it gradually loses amplitude in the real world. Suggest practical ways to reduce energy loss and predict which changes would matter most."
				}
			]
		},
		{
			title: "PHY5 Electricity and Basic Circuits",
			curriculum: [
				{
					title: "Charge, Current, Voltage, and Resistance",
					content:
						"Electricity starts with practical circuits rather than abstract field theory. Charge, current, voltage, and resistance should be tied to physical meaning. Water-flow analogies are helpful for intuition, but they are never a substitute for precise reasoning."
				},
				{
					title: "Worked Example Set: Series and Parallel Circuits",
					content:
						"Work small examples that compare bulb brightness, current paths, and the effect of opening one branch. Use Ohm's law in simple numeric settings, but keep the focus on how the circuit behaves as a system. Include troubleshooting-style questions that connect symptoms back to structure."
				},
				{
					title: "Graph and Data Exercise: Current-Voltage Tables",
					content:
						"Several current-voltage data points for the same resistor or circuit element can be collected or simulated. Graph current versus voltage, interpret the slope qualitatively, and connect the pattern to resistance. Repeated measurements matter here too, especially when contacts or batteries are imperfect."
				},
				{
					title: "Mini Lab: Circuit Build and Measurement Log",
					content:
						"Build a simple series or parallel circuit and keep a careful measurement log. Record predicted versus observed bulb behavior, current direction, and any measured voltage or current values available from classroom tools. Sketch the circuit before and after assembly."
				},
				{
					title: "Simulation Challenge: Circuit Debugging",
					content:
						"Use a simulator or drawn circuit set to diagnose why a bulb will not light, why one branch is dimmer, or why a switch placement matters. Treat debugging as a scientific reasoning task: identify the intended path, compare it to the actual path, and isolate the broken assumption."
				},
				{
					title: "Reflection Question: What Does a Diagram Hide or Reveal?",
					content:
						"Compare a physical breadboard or battery-and-bulb setup with its schematic diagram. A strong response explains which representation helps more with building and which helps more with reasoning."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: predict what happens when one component is removed or replaced before touching the hardware. A good checkpoint explains current and voltage in the same circuit without mixing the two ideas."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating current as something that gets 'used up' by the first bulb in a series circuit, assuming a battery supplies a fixed current no matter the circuit, and confusing an open circuit with a weaker circuit rather than a broken path."
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
					title: "Wave Behavior Across Media",
					content:
						"Amplitude, wavelength, frequency, and wave speed can be developed through visual and auditory examples. Mechanical waves such as sound and electromagnetic waves such as light should be compared through shared wave ideas first. This module should make physics feel highly observable and pattern-based."
				},
				{
					title: "Worked Example Set: Pitch, Color, and Wave Speed",
					content:
						"Work examples that connect higher frequency with higher pitch, compare louder versus softer sounds through amplitude, and relate color differences to light frequency or wavelength. Include a simple wave-speed relationship problem and one example involving reflection or refraction."
				},
				{
					title: "Graph and Data Exercise: Reading Waveforms",
					content:
						"Interpret snapshots of waves and wave-versus-time graphs so amplitude, period, and wavelength can be read from more than one representation. If possible, compare a generated sound waveform with the sound being heard. Use the exercise to reinforce that graphs describe measurable quantities, not artistic shapes."
				},
				{
					title: "Mini Lab: Resonance and Sound Demo",
					content:
						"Run a resonance-focused demo using tuning forks, cups, strings, or a digital tone generator. Identify which variable is being changed, what happens near resonance, and how energy transfer becomes easier when frequencies match."
				},
				{
					title: "Simulation Challenge: Light, Reflection, and Refraction",
					content:
						"Use a ripple tank, mirror setup, or light simulation to compare reflection and refraction. Predict path changes first, then test the prediction and explain the result using wave ideas instead of only memorized rules."
				},
				{
					title: "Reflection Question: Why Are Waves So Good for Modeling Patterns?",
					content:
						"Explain how the same wave vocabulary helps describe music, water patterns, and light behavior. Include at least one comparison between a sound example and a light example."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify amplitude, frequency, and wavelength from both pictures and graphs. Prompt: explain what changes when a sound gets louder versus when it gets higher in pitch."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common mistakes include mixing up amplitude with frequency, assuming waves always transport matter forward rather than mainly transporting energy, and thinking light needs a medium in the same way sound does."
				},
				{
					title: "Extension Project: Sound Wave or Resonance Demo",
					content:
						"Design a demonstration that shows standing waves, resonance, or frequency changes clearly enough to be explained back from the evidence. Include a prediction, an observation, and a short explanation of what the wave model gets right."
				}
			]
		},
		{
			title: "PHY7 Capstone Lab and Scientific Communication",
			curriculum: [
				{
					title: "Designing a Fair Physics Investigation",
					content:
						"The capstone brings the course together by revisiting scientific questions, variables, controls, uncertainty, and model limits. A strong capstone combines conceptual understanding, graphing, experimental design, and clear communication rather than just producing a flashy result."
				},
				{
					title: "Worked Example Set: Turning a Question into a Testable Plan",
					content:
						"Work through how to refine a broad idea into a focused question, how to identify independent and dependent variables, and how to choose a useful graph before collecting data. Include one weak plan and one improved plan so the contrast makes a manageable investigation easier to recognize."
				},
				{
					title: "Graph and Data Exercise: Choosing the Best Representation",
					content:
						"Give a small capstone-style dataset, then decide whether a line graph, scatterplot, bar chart, or energy storyboard communicates the result best. Justify the choice in terms of the question being answered, not just visual preference."
				},
				{
					title: "Mini Lab: Grand Experiment Proposal",
					content:
						"Draft and revise the final experiment or modeling challenge before full execution. Accept options such as a motion study, energy audit, bridge-force analysis, simple circuit investigation, or resonance demo, as long as the question is narrow and the data plan is realistic."
				},
				{
					title: "Communication and Defense of Results",
					content:
						"Include a short report, slideshow, poster, or recorded explanation with the question, setup, graph or table, claim, and evidence. Also explain one investigation limitation and one improvement that would matter with more time."
				},
				{
					title: "Reflection Question: How Has Your Physics Thinking Changed?",
					content:
						"Compare how evidence, graphs, and models were handled at the start of the course versus at the end. The reflection should make scientific growth visible, not just review vocabulary."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: propose a question that is narrow enough to test, identify uncertainty honestly, and choose a graph that matches the data type. A strong checkpoint predicts in advance what result would count as evidence for or against the hypothesis."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating a lab as successful only when the hypothesis is confirmed, using polish to hide weak evidence, and jumping to explanations before controlling variables."
				},
				{
					title: "Capstone Option: A Grand Experiment",
					content:
						"Design and carry out an original physics experiment or simulation-based investigation using one of the major course themes. Start with a focused question, justify the setup, collect repeatable evidence, and defend the conclusion with a graph or clearly labeled model."
				}
			]
		},
		{
			title: "PHY8 Momentum, Impulse, and Collisions",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Momentum treats motion as a conserved, direction-aware quantity during short interactions. Impulse connects force and time to a change in momentum, which makes collisions, recoil, and impact safety easier to analyze than force alone."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Name the system before choosing an equation: a cart pair, a ball and wall, or a person and safety device can each define different internal and external forces. Track momentum before and after the interaction, choose a positive direction, and use force-time area when the evidence is an impulse graph."
				},
				{
					title: "Worked Example Set",
					content:
						"Use collisions, recoil, impact safety, and force-time graphs as the core examples. Each problem should start with a before-and-after sketch, a prediction about which object changes momentum most, the conservation or impulse calculation, and a reasonableness check on direction and units."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Create a representation for Momentum, Impulse, and Collisions with at least one graph, diagram sequence, or data table. Read a force-time graph and shade the impulse area, then compare it with a before-and-after momentum table. The useful representation shows whether momentum is conserved inside the chosen system or changed by an external impulse."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a collision simulation, provided cart data, or a video case study of an impact safety design. The final explanation identifies the system, the momentum or impulse evidence, and one simplification such as friction, deformation, or measurement timing."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a different collision or safety device and explain what changes when contact time increases. A strong transfer distinguishes reduced force from reduced momentum change."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify the system boundary, the positive direction, the before-and-after momentum values, and whether external impulse is being ignored or measured. The explanation should say why conservation applies or why impulse is the better model."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating momentum as a scalar, assuming kinetic energy is always conserved in collisions, forgetting direction signs, and describing airbags as reducing momentum change rather than increasing stopping time to reduce average force."
				},
				{
					title: "Extension Project: Impact Safety Brief",
					content:
						"Create a helmet, bumper, or sports-impact safety brief. Use an impulse or energy model to explain how the design changes force, time, distance, or energy transfer; include a diagram, one calculation or evidence-based comparison, and one limitation of the model."
				}
			]
		},
		{
			title: "PHY9 Rotational Motion and Torque Basics",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Rotational motion starts with pivots, lever arms, and the direction of rotation a force would cause. Torque depends on force, distance from the pivot, and angle, so the same push can have a different effect depending on where and how it is applied."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Mark the pivot first, then draw the force direction and perpendicular lever arm. Classify torques as clockwise or counterclockwise before calculating so equilibrium and rotation direction are visible in the diagram."
				},
				{
					title: "Worked Example Set",
					content:
						"Use doors, wrenches, seesaws, balance beams, and rotating tools as the main examples. For each example, compare at least two force locations or angles so the lever-arm idea is tested instead of memorized."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Build a torque table with force, lever arm, torque direction, and net torque. A balance-beam diagram should show how equal forces can fail to balance when their distances from the pivot differ."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a seesaw simulation, door-handle case, or paper balance model. The final explanation shows the pivot, identifies all torques, and states which small real-world effects were ignored, such as friction at the hinge."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a new object such as a steering wheel, wrench, or crane arm. Explain why a longer handle helps and when extra length would stop being the only important design factor."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: locate the pivot, draw the applied force, identify the perpendicular lever arm, and predict clockwise or counterclockwise rotation before calculating torque."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include measuring distance along the object instead of perpendicular distance to the force line, mixing clockwise and counterclockwise signs, and assuming the largest force always creates the largest torque."
				},
				{
					title: "Extension Project: Rotation and Torque Audit",
					content:
						"Create an everyday rotation audit for a door, wrench, seesaw, balance tool, or similar object. Identify the pivot, force direction, lever arm, and torque direction; include a labeled diagram, one numeric or proportional comparison, and one assumption that affects the conclusion."
				}
			]
		},
		{
			title: "PHY10 Fluids, Pressure, and Buoyancy",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Fluids connect pressure, density, and buoyancy through contact forces spread over area and through the fluid displaced by an object. Pressure explains why the same force can feel different over different areas, while buoyancy explains floating as an upward force from the surrounding fluid."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Separate three questions before calculating: how much force is spread over what area, how much mass is packed into what volume, and how much fluid is displaced. This prevents pressure, density, and buoyant force from blending into one vague 'floating' idea."
				},
				{
					title: "Worked Example Set",
					content:
						"Use snowshoes, hydraulic lifts, boats, submarines, and sink-float data as the main examples. Compare cases where changing area changes pressure, changing volume changes density, or changing displaced fluid changes buoyant force."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Create a density table or pressure comparison chart, then use it to predict floating, sinking, or surface pressure. A strong representation labels the material, volume, mass, area, and force so the conclusion is tied to measurable quantities."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a buoyancy simulation, boat-shape design case, or provided fluid-density dataset. The final explanation identifies the displaced-fluid evidence and states one limitation, such as treating the fluid as still or ignoring object deformation."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a new object such as a ship, balloon, submarine, or snowshoe. Explain whether pressure, density, or buoyancy is the main idea and what extra measurement would make the prediction stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: distinguish pressure, density, and buoyant force in the same scenario. The answer should identify area, volume, mass, displaced fluid, and whether the object-fluid system is being simplified."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include saying heavy objects always sink, treating pressure and force as identical, ignoring area, and using density without specifying the material or the volume being compared."
				},
				{
					title: "Extension Project: Boat Shape and Buoyancy Design",
					content:
						"Design a boat-shape explanation that connects density, displaced fluid, and floating or sinking. Include a cross-section or side-view model, a mass-volume or displacement comparison, and a short note about what the simplified model ignores."
				}
			]
		},
		{
			title: "PHY11 Heat, Temperature, and Thermal Energy",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Thermal physics separates temperature from total thermal energy and uses heat transfer to explain warming, cooling, insulation, and phase changes. The same temperature change can require different energy amounts because mass, material, and phase matter."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Start by naming the system, surroundings, and direction of energy transfer. Then choose whether the situation is about temperature change, phase change, conduction, convection, radiation, or a combination of several transfer paths."
				},
				{
					title: "Worked Example Set",
					content:
						"Use insulation, cooling curves, heating curves, cooking, climate, and electronics as the main examples. Compare cases where temperature changes steadily with cases where added energy changes phase instead of temperature."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Read a heating or cooling curve and label warming segments, phase-change plateaus, and transfer direction. A data table should connect mass, material, temperature change, and energy so the graph is more than a line shape."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a thermal simulation, insulation design case, or provided temperature dataset. The final explanation states the transfer path, evidence for warming or cooling, and one uncontrolled factor such as airflow, contact area, or sensor delay."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a new thermal design such as a cooler, phone heat sink, winter coat, or cooking container. Explain which transfer path dominates and what data would test that claim."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: separate temperature, heat transfer, total thermal energy, and phase change in one scenario. The explanation should identify the system, surroundings, and direction of energy flow."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating heat and temperature as the same thing, assuming all materials warm equally, ignoring mass, and describing insulation as creating heat rather than slowing energy transfer."
				},
				{
					title: "Extension Project: Thermal Design Memo",
					content:
						"Write a thermal design memo for cooling, warming, insulation, or reducing heat loss. Separate temperature from total thermal energy, identify the heat-transfer path, and include a diagram or table plus one revision that would improve the design."
				}
			]
		},
		{
			title: "PHY12 Optics, Mirrors, Lenses, and Images",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Optics uses ray models to explain reflection, refraction, focal points, and image formation. Mirrors and lenses become easier to reason about when the path of light is drawn before image properties are calculated."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Identify the optical element, incoming ray direction, normal line, focal point, and image side before using equations. Ray diagrams are the first model; formulas refine distances and magnification after the geometry is clear."
				},
				{
					title: "Worked Example Set",
					content:
						"Use mirrors, eyeglasses, cameras, projectors, telescopes, and lens simulations as the main examples. Compare real and virtual images, converging and diverging behavior, and cases where changing object distance changes the image."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Draw ray diagrams for several object positions and record image orientation, relative size, and image type. The diagram should show reflection or refraction rules explicitly rather than only reporting an answer."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a lens simulation, mirror case study, or provided optical-device diagram. The final explanation connects the ray model to the device purpose and names one limitation such as ideal thin lenses or ignoring lens thickness."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a new optical device and explain which ray behavior matters most. A strong response distinguishes what the ray diagram predicts from what a real device adds through materials, apertures, and alignment."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: draw at least two correct rays, identify the image as real or virtual, and explain whether the model is using reflection, refraction, or both."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include using lens formulas before deciding image type, drawing rays that bend without a normal line, treating virtual images as fake, and forgetting that ray models are simplified representations of light behavior."
				},
				{
					title: "Extension Project: Optical Device Explainer",
					content:
						"Explain an optical device such as glasses, a mirror, a camera, a telescope, or a projector. Use a ray diagram to show reflection or refraction, name the design constraint, and state which parts of the real device the simplified ray model does not capture."
				}
			]
		},
		{
			title: "PHY13 Magnetism and Electromagnetic Induction",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Magnetism connects fields, moving charge, coils, motors, generators, and induction. The module emphasizes how electric current can create magnetic effects and how changing magnetic conditions can produce electrical effects."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Start with a field diagram, current direction, coil orientation, and energy transformation. Then decide whether the situation is about an electromagnet, a force on a current, a motor effect, a generator effect, or a changing-field induction effect."
				},
				{
					title: "Worked Example Set",
					content:
						"Use electromagnets, speakers, relays, generators, wireless charging, and field diagrams as the main examples. For each example, trace current, magnetic field, motion or changing field, and the resulting energy transfer."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Create a field-line sketch or input-output table for a magnetic device. The useful representation shows direction, relative strength, and what changes when current, coil turns, magnet motion, or distance changes."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use an electromagnet simulation, generator case study, or speaker/motor diagram. The final explanation identifies the field interaction and one simplification, such as ideal coils, uniform fields, or neglected losses."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model between a motor and a generator. Explain which direction the energy conversion runs, which parts stay analogous, and what evidence distinguishes mechanical-to-electrical from electrical-to-mechanical behavior."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify current direction, magnetic field direction, device purpose, and energy transformation before using vocabulary such as motor, generator, or induction."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating magnetic fields as visible material lines, describing magnets as storing unlimited energy, mixing up motors and generators, and ignoring the role of changing fields in induction."
				},
				{
					title: "Extension Project: Electromagnetic Device Brief",
					content:
						"Create an electromagnetic device brief for a speaker, generator, motor, relay, or charger. Trace the energy transformation, identify the role of current and magnetic field, and include one piece of evidence that distinguishes the model from a purely mechanical explanation."
				}
			]
		},
		{
			title: "PHY14 Simple Harmonic Motion and Resonance",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Simple harmonic motion describes repeated motion around equilibrium. Amplitude, period, frequency, damping, and resonance explain why springs, pendulums, instruments, and structures can respond strongly to repeated pushes."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Identify the equilibrium point, restoring effect, amplitude, period, and energy changes during the cycle. Then decide whether damping or driving frequency is important enough to include in the model."
				},
				{
					title: "Worked Example Set",
					content:
						"Use springs, pendulums, swings, instruments, bridges, and resonance graphs as the main examples. Compare free oscillation, damped oscillation, and driven oscillation so resonance is tied to evidence rather than treated as a dramatic word."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Read position-time or amplitude-frequency graphs and identify amplitude, period, frequency, damping, and resonance peaks. A strong graph explanation connects the shape to energy transfer and restoring motion."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a pendulum simulation, spring dataset, sound resonance example, or bridge case study. The final explanation identifies the driving pattern, the response, and one factor that would add damping or shift the period."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model to a different oscillating system and decide whether simple harmonic motion is a good approximation. Explain what would break the approximation, such as large angles, friction, nonlinear springs, or irregular driving."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify equilibrium, amplitude, period, frequency, and whether damping or driving is present. The explanation should separate one full cycle from one crossing of equilibrium."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include confusing amplitude with period, assuming resonance always destroys a system, ignoring damping, and treating every repeated motion as perfectly simple harmonic."
				},
				{
					title: "Extension Project: Resonance Case Study",
					content:
						"Build a resonance case study from music, engineering, medicine, or electronics. Identify the system, natural frequency or driving pattern, what increases the response, and what damping or design choice controls the effect."
				}
			]
		},
		{
			title: "PHY15 Astronomy, Gravity, and Orbits",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Astronomy extends gravity from falling objects to planets, moons, satellites, and orbital motion. Orbits are modeled as continuous falling around a central body, not as motion without gravity."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Name the central body, orbiting object, distance scale, velocity direction, and gravitational force direction. Then decide whether the task is comparing weight, explaining an orbit, reading planetary data, or reasoning about escape and capture."
				},
				{
					title: "Worked Example Set",
					content:
						"Use planetary data, satellite orbits, weight on other worlds, and orbit simulations as the main examples. For each example, connect the diagram to gravitational force direction and the motion that follows."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Compare orbital radius, period, speed, or surface gravity using a table or scaled diagram. The representation should reveal that distance and mass both matter, and that visual scale can be misleading without units."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use an orbit simulation, mission sketch, or provided planetary dataset. The final explanation shows force direction, velocity direction, and one simplification such as circular orbit assumptions or ignoring atmospheric drag."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model from a satellite to a moon, planet, or spacecraft maneuver. Explain why orbiting is not escaping gravity and what data would be needed to compare two orbital paths."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: draw force and velocity directions for an orbiting object, then explain the difference between falling, orbiting, and escaping in terms of speed and gravitational interaction."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include saying there is no gravity in orbit, drawing orbital force forward along the path, using not-to-scale diagrams as evidence, and confusing mass with weight on different worlds."
				},
				{
					title: "Extension Project: Mission Planning Sketch",
					content:
						"Create a mission-planning sketch that uses gravity and orbit constraints. Show the central body, path, velocity direction, and force direction; explain why orbiting is not the same as escaping gravity, and identify one missing real-world complication."
				}
			]
		},
		{
			title: "PHY16 Modern Physics and Model Limits",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Modern physics introduces places where classical models stop being enough. Spectra, photons, quantized energy, semiconductors, and timing effects show that a model can be useful in one domain while needing replacement or refinement in another."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Start by naming the classical expectation, the evidence that strains it, and the newer idea that explains the observation better. This keeps modern physics grounded in model limits rather than turning it into disconnected facts."
				},
				{
					title: "Worked Example Set",
					content:
						"Use emission spectra, absorption, solar panels, lasers, semiconductors, and GPS timing as the main examples. For each example, identify the observed evidence, the classical idea that is insufficient, and the newer model feature that improves the explanation."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Read a spectrum, energy-level diagram, or device data table. The representation should make discrete energies, absorption/emission patterns, or model breakdown visible instead of only naming quantum vocabulary."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a spectrum simulation, semiconductor case study, photoelectric-effect visualization, or GPS timing scenario. The final explanation connects evidence to model limits and avoids claiming more precision than the introductory model supports."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Transfer the model-limit idea to a new technology or observation. Explain which classical idea still helps, which part fails, and what evidence would justify introducing the newer model."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: name the observation, the classical model being challenged, and the modern-physics idea that handles the evidence better. The response should avoid vague claims that quantum physics is simply 'weird.'"
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include treating modern physics as magic, claiming classical physics is useless, confusing photons with ordinary particles in every respect, and using device names without explaining the evidence behind the model."
				},
				{
					title: "Extension Project: Modern Physics Explainer",
					content:
						"Write a modern-physics explainer that names a classical model, the evidence that strains it, and the newer idea that handles the case better. Include a diagram, spectrum, data snippet, or device example and one caution about oversimplifying the topic."
				}
			]
		},
		{
			title: "PHY17 Engineering Design and Physics Portfolio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"The final portfolio turns physics knowledge into a defended design or investigation. A strong portfolio uses a focused question, a model, evidence, uncertainty, and at least one design tradeoff rather than collecting disconnected artifacts."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Choose one physics thread, define the system, state the assumption that makes the model usable, and decide what evidence would support or weaken the claim. Calculations and graphs should serve the argument rather than appear as decoration."
				},
				{
					title: "Worked Example Set",
					content:
						"Review portfolio artifacts from motion, forces, circuits, collisions, waves, thermal systems, or space. For each artifact, identify the claim, the model used, the evidence, and the limitation that would need improvement in a second revision."
				},
				{
					title: "Graph, Diagram, or Data Exercise",
					content:
						"Select the graph, diagram, data table, or storyboard that best supports the final claim. The chosen representation should make the relationship visible and include units, labels, and enough context for someone else to evaluate the evidence."
				},
				{
					title: "Mini Lab, Simulation, or Case Study",
					content:
						"Use a safe remote simulation, provided dataset, video observation, or paper design case as the final evidence source. The final explanation states the claim, evidence, model, uncertainty, and revision decision in a single coherent argument."
				},
				{
					title: "Reflection and Transfer Practice",
					content:
						"Close by transferring the portfolio model to a related design or investigation. Explain what would stay the same, what would need new evidence, and which assumption is most fragile."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: confirm that the portfolio has a focused question, named model, evidence source, labeled representation, limitation, and revision plan before final polish begins."
				},
				{
					title: "Common Pitfalls",
					content:
						"Common pitfalls include making the portfolio too broad, hiding weak evidence behind visual polish, omitting units, using a graph without interpreting it, and failing to say what the model cannot explain."
				},
				{
					title: "Extension Project: Final Physics Portfolio",
					content:
						"Build a final physics design portfolio around one question, model, evidence source, and revision. Include a diagram or graph, a calculation or data-based comparison, a stated limitation, and a final paragraph explaining how the evidence changed the design."
				}
			]
		}
	]
});
