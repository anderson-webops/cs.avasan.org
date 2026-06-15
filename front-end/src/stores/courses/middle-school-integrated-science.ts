import type { RawCourse } from "./types";

export const middleSchoolIntegratedScienceCourse: RawCourse = {
	name: "Middle School Integrated Science",
	modules: [
		{
			title: "MS1 Scientific Reasoning, Models, and Data",
			curriculum: [
				{
					title: "Remote Science Workflow",
					content:
						"No beakers, kits, or required household experiments are needed. The course uses notebooks, shared simulations, images, public datasets, diagrams, short readings, and structured discussion. Optional observations are included only when they are safe, simple, and replaceable with an equivalent data or simulation option."
				},
				{
					title: "Questions, Variables, and Fair Tests",
					content:
						"Independent variables, dependent variables, controls, constants, and fair tests define whether evidence can answer a scientific question. Sample scenarios show what changes, what is measured, and what must stay the same."
				},
				{
					title: "Models as Useful Simplifications",
					content:
						"Models are tools for explaining systems, not perfect copies of reality. Diagrams, simulations, graphs, equations, and written explanations each reveal some details while hiding or simplifying others."
				},
				{
					title: "Data Practice: Tables, Graphs, and Pattern Claims",
					content:
						"Use a small dataset to practice choosing graph types, labeling axes, identifying trends, and writing a claim with evidence. Distinguish a pattern in the data from a possible explanation for the pattern."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Experimental Design Critique",
					content:
						"Review a flawed experiment description. Identify the question, variables, missing controls, possible confounders, and a revised procedure that would make the test more reliable."
				},
				{
					title: "Project: Data Story One-Pager",
					content:
						"Create a one-page explanation from a provided dataset. Include a table or graph, a claim, two evidence points, and one limitation or uncertainty."
				}
			]
		},
		{
			title: "MS2 Cells, Microscopes, and Body Systems",
			curriculum: [
				{
					title: "Cells as the Basic Unit of Life",
					content:
						"Cells are the basic unit of life, and cell theory connects living things to repeated evidence from observation. Microscope images or virtual slides support comparisons among plant, animal, and bacterial cells while keeping structure and function connected."
				},
				{
					title: "Organelles and Cell Jobs",
					content:
						"Cover the nucleus, cell membrane, cytoplasm, mitochondria, chloroplasts, cell wall, and vacuole. Keep the focus on the job of each structure and how cells meet life needs."
				},
				{
					title: "From Cells to Body Systems",
					content:
						"Connect cells, tissues, organs, and organ systems. Use the digestive, respiratory, circulatory, nervous, and muscular systems to show how specialized parts work together."
				},
				{
					title: "Guided Practice: System Interaction Case Study",
					content:
						"Use a case such as running up stairs, eating lunch, or reacting to a hot surface. Trace which body systems are involved and how matter, energy, or information moves."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Cell Analogy With Limits",
					content:
						"Create an analogy for a cell, such as a city, school, factory, or game world. Match at least six cell parts to jobs and include a section explaining where the analogy breaks down."
				},
				{
					title: "Project: Body Systems Flowchart",
					content:
						"Build a flowchart showing how at least three body systems work together in a real situation. Include arrows, short explanations, and one question the model does not answer."
				}
			]
		},
		{
			title: "MS3 Genetics, Traits, and Adaptation",
			curriculum: [
				{
					title: "DNA, Genes, and Inherited Traits",
					content:
						"DNA and genes act as instructions that influence traits. Inherited traits should be distinguished from learned behaviors and environmental effects without overcomplicating molecular biology."
				},
				{
					title: "Variation and Natural Selection",
					content:
						"Individuals in a population vary, and some variations can affect survival and reproduction. Simulations or screen-based card examples can model the pattern without physical manipulatives."
				},
				{
					title: "Adaptations Are Population-Level Changes",
					content:
						"Clarify that individual organisms do not choose to evolve. Populations change over generations when inherited traits become more or less common."
				},
				{
					title: "Guided Practice: Trait Data and Environmental Pressure",
					content:
						"Analyze a small dataset showing trait frequencies before and after an environmental change. Identify the selected trait and explain the evidence."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adaptation Evidence Brief",
					content:
						"Choose an organism and explain one adaptation. Include the environmental challenge, the trait, how the trait helps, and what evidence would support the explanation."
				},
				{
					title: "Project: Selection Simulation Reflection",
					content:
						"Use a provided simulation or dataset to track how trait frequencies change. Summarize the starting variation, environmental pressure, result, and one limitation of the model."
				}
			]
		},
		{
			title: "MS4 Ecosystems, Energy Flow, and Human Impact",
			curriculum: [
				{
					title: "Energy Flow and Matter Cycling",
					content:
						"Producers, consumers, decomposers, food webs, and energy pyramids describe how ecosystems move resources. Energy flows through ecosystems while matter cycles through organisms and the environment."
				},
				{
					title: "Population Dynamics",
					content:
						"Carrying capacity, limiting factors, competition, predation, disease, and resource availability all affect population size. Graphs and scenarios make it possible to predict population changes from evidence."
				},
				{
					title: "Biodiversity and Ecosystem Stability",
					content:
						"Connect biodiversity to resilience and ecosystem services. Use examples such as pollination, soil health, clean water, fisheries, and forests."
				},
				{
					title: "Case Study: Human Impact and Tradeoffs",
					content:
						"Analyze a case involving land use, pollution, invasive species, conservation, or climate pressure. Identify stakeholders, benefits, costs, and evidence."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ecosystem Impact Memo",
					content:
						"Write a short memo about a human impact on an ecosystem. Include background, affected organisms, evidence, tradeoffs, and one practical recommendation."
				},
				{
					title: "Project: Food Web Stability Analysis",
					content:
						"Create or analyze a food web, then remove or increase one organism. Predict direct and indirect effects and explain which relationships are most important."
				}
			]
		},
		{
			title: "MS5 Earth Systems, Weather, and Climate Data",
			curriculum: [
				{
					title: "Earth as Interacting Systems",
					content:
						"The geosphere, hydrosphere, atmosphere, and biosphere are interacting Earth systems. One event, such as a wildfire, storm, or drought, can affect several systems at once."
				},
				{
					title: "Weather, Air Masses, and Forecasting",
					content:
						"Cover temperature, pressure, humidity, fronts, wind, clouds, and precipitation. Use maps and forecasts to show how meteorologists infer future conditions from current data."
				},
				{
					title: "Climate Patterns and Climate Change",
					content:
						"Distinguish weather from climate and short-term variation from long-term trends. Use graphs of temperature, precipitation, or carbon dioxide and discuss evidence-based reasoning."
				},
				{
					title: "Data Practice: Reading Earth Science Graphs",
					content:
						"Analyze a real or simplified dataset involving temperature, precipitation, sea level, storm frequency, or carbon dioxide. Identify the trend, scale, and uncertainty."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Weather Forecast Reasoning",
					content:
						"Use a weather map or forecast data to write a reasoned forecast for a city. Include current conditions, expected change, evidence, and one uncertainty."
				},
				{
					title: "Project: Climate Data Explainer",
					content:
						"Create a slide or one-page explainer for a climate dataset. Include a graph, trend statement, possible causes or impacts, and a note about what the data does not prove by itself."
				}
			]
		},
		{
			title: "MS6 Matter, Atoms, and Chemical Change",
			curriculum: [
				{
					title: "Atoms, Elements, Molecules, and Compounds",
					content:
						"Particle-level explanations connect visible matter to atoms, elements, molecules, compounds, mixtures, and pure substances. Diagrams and formulas help distinguish these categories."
				},
				{
					title: "Conservation of Matter",
					content:
						"Atoms are rearranged during physical and chemical changes, but matter is conserved in closed systems. Balanced visual models can show conservation without requiring physical reactions."
				},
				{
					title: "Physical vs. Chemical Change",
					content:
						"Compare melting, dissolving, cutting, burning, rusting, cooking, and reacting. Look for evidence such as gas formation, color change, temperature change, precipitate formation, and new substances."
				},
				{
					title: "Simulation Practice: Particle Models of Reactions",
					content:
						"Use an online particle model or provided diagrams. Track atoms before and after a reaction and explain why coefficients are needed in simple chemical equations."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Particle Model Explanation",
					content:
						"Create a before-and-after particle diagram for a physical or chemical change. Label atoms or molecules and explain what changed and what stayed conserved."
				},
				{
					title: "Project: Chemical Change Evidence Case File",
					content:
						"Review a set of provided scenarios and classify each as physical change, chemical change, or not enough information. Explain the evidence and uncertainty for each case."
				}
			]
		},
		{
			title: "MS7 Energy, Heat, and Engineering Tradeoffs",
			curriculum: [
				{
					title: "Forms and Transfers of Energy",
					content:
						"Kinetic, potential, thermal, chemical, electrical, light, and sound energy are useful categories for tracking systems. The focus is energy transfer and transformation rather than memorizing isolated forms."
				},
				{
					title: "Heat Transfer",
					content:
						"This section covers conduction, convection, and radiation using diagrams, simulations, and everyday examples. Identify which transfer method dominates in a given scenario."
				},
				{
					title: "Energy Efficiency and Constraints",
					content:
						"Useful energy, wasted energy, efficiency, cost, reliability, safety, and environmental impact all shape engineering decisions. The topic should be treated as a tradeoff analysis, not a single right answer."
				},
				{
					title: "Guided Practice: Energy Flow Diagrams",
					content:
						"Draw energy flow diagrams for systems such as a phone charging, a roller coaster, a lamp, a refrigerator, or a car. Identify inputs, outputs, and losses."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Energy Audit From a Diagram",
					content:
						"Analyze a provided diagram of a home, device, vehicle, or school system. Identify where energy enters, where it is used, where it is lost, and one improvement with tradeoffs."
				},
				{
					title: "Project: Heat Transfer Storyboard",
					content:
						"Create a storyboard explaining conduction, convection, and radiation in one setting. Use arrows and short labels to show the direction of energy transfer."
				}
			]
		},
		{
			title: "MS8 Forces, Motion, and Graphs",
			curriculum: [
				{
					title: "Position, Speed, Velocity, and Acceleration",
					content:
						"Define motion quantities and relate them to everyday examples. Use simple calculations and graphs to connect words, numbers, and visual representations."
				},
				{
					title: "Newton's Laws in Plain Language",
					content:
						"Inertia, force causing acceleration, and action-reaction pairs provide a plain-language entry point to Newton's laws. Diagrams and scenarios are more useful here than formal derivations."
				},
				{
					title: "Gravity, Friction, and Normal Force",
					content:
						"Common forces and free-body diagrams simplify motion problems by showing which forces act on one object. Practice should include force arrows and predictions about whether motion will change."
				},
				{
					title: "Data Practice: Motion Graph Interpretation",
					content:
						"Analyze position-time and speed-time graphs. Describe motion, calculate simple speed, and identify where an object is speeding up, slowing down, or staying steady."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Motion Graph Comic",
					content:
						"Create a story that matches a provided motion graph, or create a motion graph for a story. Include labels for speed changes and explain how the graph shows the motion."
				},
				{
					title: "Project: Force Diagram Challenge Set",
					content:
						"Draw free-body diagrams for several provided scenarios. For each, predict whether the object speeds up, slows down, changes direction, or stays balanced."
				}
			]
		},
		{
			title: "MS9 Waves, Light, Sound, Electricity, and Magnetism",
			curriculum: [
				{
					title: "Wave Properties",
					content:
						"Amplitude, wavelength, frequency, and wave speed describe wave behavior. Simulations and diagrams can compare water waves, sound waves, light waves, and seismic waves."
				},
				{
					title: "Light and Sound Interactions",
					content:
						"Reflection, absorption, transmission, refraction, echoes, pitch, and loudness show how waves interact with matter. Waves carry energy and information, so the same vocabulary supports both science and communication examples."
				},
				{
					title: "Electricity and Circuits",
					content:
						"Charge, current, voltage, resistance, conductors, insulators, series circuits, and parallel circuits can be modeled with virtual circuit builders rather than physical components."
				},
				{
					title: "Magnetism and Electromagnetism",
					content:
						"Magnetic poles, fields, compasses, motors, generators, and electromagnets can be handled at a conceptual level. Visual field models and simple cause-and-effect reasoning are enough for this stage."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Virtual Circuit Investigation",
					content:
						"Use a circuit simulation or provided screenshots to compare series and parallel circuits. Explain how brightness, current path, and failure behavior differ."
				},
				{
					title: "Project: Wave Communication Design",
					content:
						"Create a communication system that uses light, sound, radio, or another wave. Explain the source, signal, receiver, possible interference, and one design improvement."
				}
			]
		},
		{
			title: "MS10 Space Systems and Integrated Science Capstone",
			curriculum: [
				{
					title: "Earth, Moon, Sun, and Gravity",
					content:
						"Day and night, seasons, Moon phases, eclipses, tides, and orbital motion can be explained with models and animations. Model limitations and common misconceptions should stay visible."
				},
				{
					title: "Solar System Scale and Planetary Conditions",
					content:
						"Planets, moons, asteroids, and comets can be compared by distance, size, gravity, atmosphere, temperature, and surface conditions. Scale models are difficult because space is enormous, but they are still useful for reasoning."
				},
				{
					title: "Stars, Galaxies, and Evidence From Light",
					content:
						"Stars, galaxies, spectra, and the idea that light carries information about distant objects connect astronomy to evidence. The focus should remain on scientific inference from observations."
				},
				{
					title: "Capstone Studio: Research, Model, Explain, Revise",
					content:
						"Choose a question from life science, Earth science, physical science, or space science. Build a model or analysis, explain evidence, receive feedback, and revise the final presentation."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Space Systems Model Critique",
					content:
						"Compare two models of a space system such as Moon phases, seasons, or the solar system. Identify what each model explains well, what it distorts, and how to improve it."
				},
				{
					title: "Project: Middle School Science Capstone",
					content:
						"Create a final science presentation with a question, background, data or evidence, model, explanation, limitation, and next question. The format can be slides, a written brief, or a recorded explanation."
				}
			]
		}
	]
};
