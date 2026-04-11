import type { RawCourse } from "./types";

export const introToChemistryCourse: RawCourse = {
	name: "Intro to Chemistry",
	modules: [
		{
			title: "CHM1 Chemistry Basics",
			curriculum: [
				{
					title: "Introductions, Setup, and Scientific Habits",
					content:
						"Start the course by setting up a simple chemistry workflow: a notebook or digital document for observations, a place to store photos of experiments, and a clear expectation that chemistry is about explaining visible behavior using particles we cannot see directly. Keep the setup light and experiment-friendly rather than code-heavy, and emphasize safety, cleanup, and careful observation from the first session."
				},
				{
					title: "Concept Lesson: Atoms, Elements, Molecules, and Compounds",
					content:
						"Introduce atoms as the building blocks of matter, then distinguish elements, molecules, and compounds using everyday examples such as water, oxygen gas, and table salt. Make sure students can explain why a desk, a drop of water, and a metal spoon are all made of atoms even though they look completely different."
				},
				{
					title: "Concept Lesson: Atomic Structure, Charge, and Atomic Mass",
					content:
						"Develop the structure of the atom with protons, neutrons, and electrons, then connect atomic number, charge, and atomic mass to what students see on the periodic table later. Use simple particle counts to show how a neutral atom differs from an ion and why charges matter for later chemistry topics."
				},
				{
					title: "Guided Exploration: Atomic Model Simulation",
					content:
						"Use an atom simulation or diagram sequence to identify the nucleus, electron cloud, atomic number, and charge. Have students change particle counts and describe how the atom's identity or charge changes, so the model feels interactive rather than memorized."
				},
				{
					title: "Mini Lab: Water Cohesion and Surface Tension",
					content:
						"Run the coin-drop experiment with water and compare it with oil or another household liquid. Use the result to introduce cohesion and surface tension, then connect those behaviors back to how water molecules attract one another."
				},
				{
					title: "Mini Lab: DIY Lava Lamp and Density",
					content:
						"Build or observe a simple oil-water lava lamp with food coloring and an effervescent tablet to compare how substances with different densities separate and move. Explain why the denser water layer sinks, why oil stays above it, and how gas bubbles temporarily change what rises and falls."
				},
				{
					title: "Reflection Question: Why Does Water Behave So Differently?",
					content:
						"Ask students to connect the atom-scale ideas from this module to the visible behavior of water in the surface-tension and density demonstrations. They should explain what chemistry can reveal that simple description alone cannot."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can distinguish atoms, elements, molecules, and compounds without mixing the terms together. Use a quick prompt asking what changes when an atom gains or loses electrons versus when it gains or loses protons."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often assume atoms are tiny solid balls with no internal structure, or that molecules and compounds are the same idea in all cases. They also commonly think density is just 'weight' instead of mass packed into a given volume."
				},
				{
					title: "Extension Project: Everyday Chemistry Observation Log",
					content:
						"Choose five everyday objects or events and describe what chemistry ideas might explain them. Include at least one example involving water, one involving a gas, and one involving a material changing appearance."
				}
			]
		},
		{
			title: "CHM2 Gases, Liquids, and Solids",
			curriculum: [
				{
					title: "Concept Lesson: States of Matter and the Particle Model",
					content:
						"Introduce solids, liquids, and gases as different particle arrangements and motion patterns rather than just lists of vocabulary words. Emphasize shape, volume, spacing, and particle motion so students can describe each state at both the visible and atomic levels."
				},
				{
					title: "Mini Lab: Making Oobleck",
					content:
						"Use Oobleck to challenge the idea that every material behaves like a perfect textbook solid or liquid. Ask students to press, squeeze, and release the material, then explain why it seems solid under sudden force but flows more like a liquid when handled gently."
				},
				{
					title: "Guided Comparison: Apple, Water, and Balloon",
					content:
						"Compare an apple, a glass of water, and an air-filled balloon as concrete examples of solids, liquids, and gases. Have students draw or describe how particles would be arranged inside each one and how freely those particles can move."
				},
				{
					title: "Worked Example Set: Particle Motion Across Phases",
					content:
						"Work through what happens to particle spacing, motion, and energy in solids, liquids, and gases. Use clear comparisons such as 'keeps its shape,' 'takes the shape of its container,' and 'spreads to fill available space' to organize the discussion."
				},
				{
					title: "Design Challenge: Real-World Use for a Weird Material",
					content:
						"Ask students to propose a practical use for a material like Oobleck or another unusual substance. Push them to justify the idea using the material's observed properties rather than imagination alone."
				},
				{
					title: "Reflection Question: When Do Categories Start to Blur?",
					content:
						"Have students explain why Oobleck is useful even though it does not fit neatly into a single state-of-matter label in everyday language. This reflection should reinforce that scientific models are tools that sometimes need refinement rather than rigid boxes."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can describe each state of matter using particle arrangement and motion, not just examples. Use one prompt where they must explain why air in a balloon can change shape while the balloon material itself remains a solid."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think gases are 'weightless' or that liquids have no structure at all. They may also assume anything that pours must be a liquid in the same sense as water. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Extension Project: Material Sorting Challenge",
					content:
						"Choose several everyday materials and sort them by which state-of-matter model fits best. For any borderline case, explain what property makes classification harder. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "CHM3 Phase Changes",
			curriculum: [
				{
					title: "Concept Lesson: Melting, Freezing, Evaporation, and Condensation",
					content:
						"Build the core idea that enough energy transfer or pressure change can move matter from one state to another without changing the substance's identity. Contrast phase changes with chemical reactions so students do not confuse visible change with chemical change."
				},
				{
					title: "Mini Lab: Soda and a Balloon",
					content:
						"Use a freshly opened bottle of soda and a balloon to capture the carbon dioxide escaping from solution. Explain that the gas was already present in the liquid under pressure and becomes visible as the system changes after the bottle is opened."
				},
				{
					title: "Simulation Challenge: States of Matter Under Heating and Compression",
					content:
						"Use a states-of-matter simulation to watch how particle motion changes when energy is added or when the container volume changes. Have students test heating, cooling, and compression separately so they can describe how temperature and pressure influence the dominant phase."
				},
				{
					title: "Worked Example Set: Coexistence, Vapor, and Everyday Phase Change",
					content:
						"Use examples such as condensation on a cold bottle, water vapor in a sealed container, and freezing or melting at familiar temperatures. Introduce the idea that more than one phase can exist at the same time in the same system."
				},
				{
					title: "Particle Storyboard: Explain a Phase Change at the Atomic Level",
					content:
						"Have students draw or narrate what particles are doing during melting, freezing, evaporation, or condensation. The focus should be on motion, spacing, and energy rather than advanced equations."
				},
				{
					title: "Reflection Question: What Actually Changes During a Phase Change?",
					content:
						"Require students to explain what stays the same and what changes when a substance moves between phases. A strong answer should mention that the substance remains the same chemically even though particle motion and arrangement change."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can separate phase change language from chemical reaction language. Use one quick prompt asking what opening a soda bottle changes: the substance itself, the pressure, or both."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think boiling or bubbling automatically means a new substance is being formed. They may also assume gases appear from nowhere rather than being released from solution or produced by particle rearrangement."
				},
				{
					title: "Extension Project: Heating and Cooling Diary",
					content:
						"Track one household example of a phase change, such as ice melting or condensation forming, over time. Describe the visible change and the particle-level explanation side by side. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "CHM4 The Periodic Table of Elements",
			curriculum: [
				{
					title: "Concept Lesson: What the Periodic Table Organizes",
					content:
						"Introduce the periodic table as an organized map of elements rather than a chart to memorize blindly. Explain symbols, atomic number, and basic table structure so students can read an element box and pull useful information from it."
				},
				{
					title: "Guided Exploration: Element Symbols, Atomic Number, and Properties",
					content:
						"Explore a periodic table interactively or with a printed reference and identify what the symbol, name, atomic number, and other listed values mean. Use hydrogen and oxygen first because they connect directly back to earlier chemistry and water examples."
				},
				{
					title: "Element Profile Activity: Compare at Least Five Elements",
					content:
						"Choose several elements from different parts of the table and record their names, symbols, atomic numbers, and one notable property or use. Use the comparison to show that the table groups together substances with shared patterns instead of arranging them randomly."
				},
				{
					title: "Pattern Hunt: Sections and Families of the Table",
					content:
						"Identify broad regions such as metals, nonmetals, and noble gases, keeping the emphasis conceptual and age-appropriate. Ask students what kinds of similarities or differences they notice across rows and columns."
				},
				{
					title: "Creative Application: Build Names and Words from Element Symbols",
					content:
						"Use periodic table symbols to spell names or short words, then write out the full element names and compare their basic properties. This keeps the table playful while reinforcing how to read and use element abbreviations."
				},
				{
					title: "Reflection Question: Why Is the Periodic Table So Useful?",
					content:
						"Ask students to explain why scientists benefit from a system that organizes elements in a predictable way. They should point to the table as a tool for understanding matter, not just as a memorization challenge."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can identify an element from its symbol and explain what the atomic number represents. Use one quick prompt asking why hydrogen and helium are placed at the start of the table even though they behave differently."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often confuse atomic number with atomic mass, or assume element symbols are always obvious abbreviations in English. They may also think nearby elements are similar only because of visual proximity rather than recurring patterns."
				},
				{
					title: "Extension Project: Mystery Element Cards",
					content:
						"Write short clue cards using atomic number, symbol, or typical uses and have students identify the matching element. Then ask them to create new clue cards for someone else to solve. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "CHM5 Chemical Reactions",
			curriculum: [
				{
					title: "Concept Lesson: Physical Change versus Chemical Change",
					content:
						"Introduce chemical reactions as processes where substances rearrange into new substances, unlike phase changes where the substance itself stays the same. Use conservation of matter and energy at an introductory level so students understand that atoms are reorganized, not created from nothing."
				},
				{
					title: "Worked Example Set: Combustion, Rust, and Reading Equations",
					content:
						"Use methane combustion and rust formation to explain reactants, products, coefficients, subscripts, and state symbols such as solid, liquid, and gas. Emphasize how the written equation summarizes a real change happening at the particle level."
				},
				{
					title: "Particle Modeling Exercise: Track Atoms Through a Reaction",
					content:
						"Have students count atoms on both sides of a simple equation and explain how the same atoms are rearranged into new products. This should reinforce conservation more clearly than memorizing vocabulary alone."
				},
				{
					title: "Mini Lab: Elephant Toothpaste",
					content:
						"Use the elephant-toothpaste reaction to discuss catalysts, gas release, and why trapped oxygen bubbles create a dramatic foam. Ask students to identify the trigger for the reaction and explain what visible clues suggest that a chemical change occurred."
				},
				{
					title: "Mini Lab: Baking Soda Volcano",
					content:
						"Use the classic vinegar and baking soda reaction to introduce acid-base reactions and carbon dioxide production. Compare the volcano to elephant toothpaste so students see that different reactions can both create gas while operating by different chemistry."
				},
				{
					title: "Reflection Question: How Can You Tell a Reaction Happened?",
					content:
						"Require students to distinguish strong evidence of chemical change, such as gas production, temperature change, or new products, from weaker clues such as movement alone. They should compare at least one reaction with at least one physical change from earlier modules."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can explain the difference between coefficients and subscripts and can identify reactants versus products. Use a prompt asking whether melting ice and rusting iron are the same kind of change and why."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often think fire, bubbling, or color change always means the same kind of reaction, or that energy appearing in a reaction means it was created on the spot. They may also think balancing equations changes the chemistry instead of simply describing it correctly."
				},
				{
					title: "Extension Project: Reaction Detective Board",
					content:
						"Collect several everyday examples and decide whether each is a chemical change or a physical change. Defend each classification with evidence rather than intuition alone. Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft."
				}
			]
		},
		{
			title: "CHM6 Solutions and Mixtures",
			curriculum: [
				{
					title: "Concept Lesson: Mixtures, Solutions, Solutes, and Solvents",
					content:
						"Introduce heterogeneous mixtures, homogeneous mixtures, and solutions, then define solute and solvent with simple examples like salt water or lemonade. Keep the focus on what remains visibly separate, what dissolves, and what the particle model predicts."
				},
				{
					title: "Mini Lab: Making Invisible Ink",
					content:
						"Use diluted lemon juice to make invisible ink and reveal it with gentle heat, then connect the result to oxidation and dilution. Have students explain why adding water changes visibility and whether the starting mixture behaves more like a mixture or a solution."
				},
				{
					title: "Simulation Challenge: What Dissolving Looks Like at the Atomic Level",
					content:
						"Use a dissolving simulation to show how water molecules surround ions or other particles in solution. Focus on the idea that dissolving is not magic disappearance but a reorganization that spreads particles throughout the solvent."
				},
				{
					title: "Concept Application: Charge, Attraction, and Solubility",
					content:
						"Connect positive and negative charges to why substances like salts can separate into ions and interact with water molecules. Keep the explanation conceptual so students understand attraction patterns without needing advanced chemistry formalism."
				},
				{
					title: "Separation Lab: Sorting Mixtures and Recovering Solids",
					content:
						"Compare how to separate rocks from gravel, sand from salt, and salt from saltwater using methods such as hand sorting, filtering ideas, dissolving, and evaporation. Use the exercise to show that how a material is mixed determines the best way to separate it."
				},
				{
					title: "Reflection Question: Why Are Some Mixtures Easy to Separate?",
					content:
						"Ask students to compare a heterogeneous mixture with a true solution and explain why one can often be separated mechanically while the other requires a process like evaporation. They should explicitly mention what is happening at the particle scale."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can name the solute and solvent in a familiar solution and can classify examples as homogeneous or heterogeneous. Use a quick prompt asking whether salt 'disappears' in water or simply changes how it is distributed."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often use mixture and solution as interchangeable terms, or think dissolved substances stop existing. They may also confuse the visible product of a reaction with the uniform appearance of a solution."
				},
				{
					title: "Extension Project: Kitchen Chemistry Sort",
					content:
						"Inspect several safe kitchen examples, such as oil and vinegar, tea, salt water, and fruit salad, and classify each one. Then propose a separation method and explain why it would or would not work."
				}
			]
		},
		{
			title: "CHM7 Chemistry Capstone and Real-World Modeling",
			curriculum: [
				{
					title: "Capstone Launch: Chemistry Is Everywhere",
					content:
						"Open the capstone by having students choose an area they care about, such as food, sports, medicine, transportation, or the environment, and identify where chemistry appears in that domain. The goal is to move from isolated experiments to a real-world chemistry explanation."
				},
				{
					title: "Research Task: Find and Explain a Relevant Reaction or Process",
					content:
						"Guide students to find a reaction, material process, or chemistry-based phenomenon connected to their chosen topic. They should identify the substances involved, what changes, and why the process matters in the larger real-world context."
				},
				{
					title: "Model-Building Exercise: Represent the Chemistry Safely",
					content:
						"Have students choose a safe way to explain the chemistry, such as a diagram, particle storyboard, household-object model, or carefully selected demonstration. The key is making the starting substances, the transformation, and the final outcome clear."
				},
				{
					title: "Scientific Communication: Present the Reaction Clearly",
					content:
						"Students should explain their chosen chemistry in plain language, then add the particle-level explanation that makes it scientific rather than purely descriptive. Encourage a short presentation or writeup that balances accuracy, visuals, and explanation."
				},
				{
					title: "Course Recap: Connect the Major Themes",
					content:
						"Review the major strands of the course: atoms, water behavior, states of matter, phase changes, the periodic table, reactions, and mixtures and solutions. Ask students to identify which idea changed their thinking the most and which experiments best revealed chemistry they could not see directly."
				},
				{
					title: "Reflection Question: How Has Your Picture of Matter Changed?",
					content:
						"Require students to explain how their understanding of everyday materials changed from the start of the course to the end. A strong response should mention at least one particle-level model and one real-world chemistry example."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Check whether students can connect a real-world process back to the chemistry ideas from earlier modules rather than treating the capstone as a disconnected presentation. Use a short oral checkpoint asking them to describe one reaction or material process at both the visible and atomic levels."
				},
				{
					title: "Misconception Watchlist",
					content:
						"Students often drift into general science storytelling without naming the actual chemistry involved. They may also choose examples that are visually interesting but too vague until they define the substances and the change more precisely."
				},
				{
					title: "Capstone Option: Chemistry in Your World Showcase",
					content:
						"Create a short showcase on one chemistry-rich topic, such as digestion, batteries, cooking, cleaning, rust prevention, or sports hydration. Include the real-world context, the chemistry process, and a model or demonstration that makes the invisible part visible."
				}
			]
		},
		{
			title: "Applied Studio 8: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 8: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 8: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 8: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 8: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 8: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 8: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 8: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 8: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 9: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 9: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 9: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 9: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 9: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 9: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 9: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 9: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 9: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 10: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 10: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 10: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 10: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 10: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 10: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 10: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 10: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 10: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 11: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 11: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 11: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 11: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 11: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 11: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 11: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 11: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 11: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 12: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 12: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 12: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 12: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 12: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 12: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 12: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 12: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 12: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 13: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 13: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 13: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 13: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 13: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 13: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 13: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 13: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 13: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 14: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 14: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 14: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 14: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 14: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 14: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 14: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 14: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 14: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 15: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 15: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 15: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 15: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 15: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 15: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 15: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 15: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 15: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 16: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 16: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 16: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 16: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 16: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 16: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 16: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 16: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 16: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		},
		{
			title: "Applied Studio 17: chemistry lab",
			curriculum: [
				{
					title: "chemistry lab: Core Concepts",
					content:
						"Introduce the main goal of Applied Studio 17: chemistry lab, define the success criteria, and review the concepts students must understand before they begin the main build or problem. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Guided Example",
					content:
						"Walk through one representative example for Applied Studio 17: chemistry lab, naming the key inputs, the expected outputs, and the checkpoints worth verifying early. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Core Project",
					content:
						"Build the central artifact for Applied Studio 17: chemistry lab. Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done."
				},
				{
					title: "chemistry lab: Review and Reflection",
					content:
						"Close Applied Studio 17: chemistry lab by testing the edge cases that matter most and writing down one improvement that would make the next iteration cleaner or safer. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			],
			supplementalProjects: [
				{
					title: "chemistry lab: Extension Challenge",
					content:
						"Extend the core build from Applied Studio 17: chemistry lab with one extra requirement, stricter input handling, or a more realistic variation of the same task. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "chemistry lab: Open Practice",
					content:
						"Create a compact variant inspired by Applied Studio 17: chemistry lab. Keep the scope tight, but require one meaningful design or reasoning decision. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				},
				{
					title: "Applied Studio 17: chemistry lab: Open-Ended Variant",
					content:
						"Create an original variation inspired by Applied Studio 17: chemistry lab. Keep the scope small, but require one meaningful design or reasoning choice. Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on."
				}
			]
		}
	]
};
