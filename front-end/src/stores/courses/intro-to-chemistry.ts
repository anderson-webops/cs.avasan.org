import type { RawCourse } from "./types";

const SIMULATIONS = {
	balancingEquations:
		"https://phet.colorado.edu/en/simulations/balancing-chemical-equations",
	buildAtom: "https://phet.colorado.edu/en/simulations/build-an-atom",
	concentration: "https://phet.colorado.edu/en/simulations/concentration",
	molarity: "https://phet.colorado.edu/en/simulations/molarity",
	moleculeShapes: "https://phet.colorado.edu/en/simulations/molecule-shapes",
	phScale: "https://phet.colorado.edu/en/simulations/ph-scale",
	reactions:
		"https://phet.colorado.edu/en/simulations/reactants-products-and-leftovers",
	statesOfMatter:
		"https://phet.colorado.edu/en/simulations/states-of-matter-basics"
} as const;

const REFERENCES = {
	acsChemistryGuidelines:
		"https://www.acs.org/education/policies/middle-and-high-school-chemistry.html",
	acsPeriodicTable:
		"https://www.acs.org/education/whatischemistry/periodictable.html",
	ngssAppendices: "https://www.nextgenscience.org/resources/ngss-appendices",
	nistSiUnits: "https://www.nist.gov/pml/owm/metric-si/si-units"
} as const;

export const introToChemistryCourse: RawCourse = {
	name: "Intro to Chemistry",
	modules: [
		{
			title: "CHM0 Chemistry Workflow, Safety, Measurement, and Models",
			curriculum: [
				{
					title: "Chemistry as Evidence-Based Explanation",
					content: [
						"**Concept path:** Chemistry explains visible matter and change using particles, energy, structure, and evidence. The course workflow uses notebooks, shared simulations, diagrams, short readings, and provided data tables rather than required household chemicals or physical lab supplies.",
						"**Remote-safe activity:** Set up a chemistry notebook with four recurring sections: observation, particle model, evidence, and claim-evidence-reasoning. Use a simple example such as ice melting, salt dissolving, or a metal object rusting to separate what can be observed from what must be inferred.",
						"**Output:** A one-page notebook template and a short explanation of why particle models can explain more than visible description alone.",
						"**CER checkpoint:** Make one claim about a visible change, cite one observable piece of evidence, and connect the evidence to a particle-level explanation."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines
				},
				{
					title: "Measurement, Units, and Data Quality",
					content: [
						"**Concept path:** Chemistry measurements need units, scale, consistency, and uncertainty. Mass, volume, temperature, time, and concentration become useful only when the unit and measuring method are clear.",
						"**Remote-safe activity:** Compare three short data tables that use different units or inconsistent precision. Identify which table is easiest to interpret, which is misleading, and which needs conversion before comparison.",
						"**Output:** A corrected table with units, one converted value, and one note explaining why unit labels matter.",
						"**CER checkpoint:** Explain how an unlabeled number can produce a wrong chemistry conclusion even when the arithmetic is correct."
					].join("\n\n"),
					datasetLink: REFERENCES.nistSiUnits
				},
				{
					title: "Models, Diagrams, and Limits",
					content: [
						"**Concept path:** A model is a useful simplification, not a perfect copy of reality. Chemistry uses particle diagrams, formulas, simulations, graphs, and equations because each representation reveals some details and hides others.",
						"**Remote-safe activity:** Compare a particle diagram, a chemical formula, and a simulation screenshot for the same substance or process. Identify one strength and one limitation of each representation.",
						"**Output:** A model-comparison table with the columns representation, what it shows well, what it hides, and when it is useful.",
						"**CER checkpoint:** Defend which model is best for explaining a beginner question about matter, and identify one question that the model cannot answer by itself."
					].join("\n\n")
				},
				{
					title: "Safety and Remote Investigation Boundaries",
					content: [
						"**Concept path:** Safe chemistry learning distinguishes required work from optional observation. Required work in this course uses simulations, diagrams, data, and writing; optional observations must always have an equivalent non-physical alternative.",
						"**Remote-safe activity:** Classify sample activities as safe remote work, optional household observation, or not appropriate for this course. Any activity involving heat, ingestion, unknown chemicals, pressure buildup, glassware, or disposal concerns is replaced by a simulation or provided dataset.",
						"**Output:** A safety decision card that lists what evidence source will be used instead of a physical experiment.",
						"**CER checkpoint:** Explain why a simulation or provided dataset can still support a chemistry claim when a physical lab is not appropriate."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines
				}
			],
			supplementalProjects: [
				{
					title: "Project: Chemistry Notebook System",
					content: [
						"**Project goal:** Build a reusable notebook page for chemistry explanations. The page must include a phenomenon, vocabulary, observation, particle model, evidence table, CER paragraph, and one changed-condition prediction.",
						"**Requirements:** Use one everyday phenomenon supplied by the course material. No household experiment is required; a photo, diagram, simulation screenshot, or provided data table is enough.",
						"**Completion checks:** The page separates observation from inference, includes units where numbers appear, and ends with a testable prediction."
					].join("\n\n")
				},
				{
					title: "Project: Model Strengths and Limits",
					content: [
						"**Project goal:** Choose two representations of the same chemistry idea and compare how well they explain it. Good choices include a formula versus a particle diagram, a graph versus a simulation, or a word explanation versus an equation.",
						"**Requirements:** Name the chemistry idea, explain what each representation shows, identify what each leaves out, and choose which one is most useful for a beginner explanation.",
						"**Completion checks:** The comparison uses at least three chemistry vocabulary terms and includes one limitation instead of claiming any model is perfect."
					].join("\n\n")
				}
			]
		},
		{
			title: "CHM1 Matter, Classification, and Particle Models",
			curriculum: [
				{
					title: "Matter, Properties, and Classification",
					content: [
						"**Concept path:** Matter has mass and takes up space. Substances can be described by physical properties such as density, melting point, boiling point, color, conductivity, solubility, and state at room temperature.",
						"**Remote-safe activity:** Sort a provided card set into matter and non-matter, then classify matter examples by observable properties. Use property evidence rather than personal familiarity.",
						"**Output:** A classification chart that distinguishes object, material, property, and evidence.",
						"**CER checkpoint:** Make a claim about whether an example counts as matter and support it with mass/space reasoning."
					].join("\n\n")
				},
				{
					title: "Pure Substances, Mixtures, Elements, and Compounds",
					content: [
						"**Concept path:** A pure substance has a fixed composition. Elements contain one kind of atom, compounds contain chemically bonded atoms in fixed ratios, and mixtures combine substances without a fixed chemical formula.",
						"**Remote-safe activity:** Classify examples such as oxygen gas, water, salt water, brass, air, carbon dioxide, and trail mix. The key is whether the composition is fixed and whether atoms are bonded into a new substance.",
						"**Output:** A decision tree for element, compound, homogeneous mixture, and heterogeneous mixture.",
						"**CER checkpoint:** Explain why salt water is not the same category as sodium chloride even though both contain sodium and chlorine."
					].join("\n\n")
				},
				{
					title: "Particle Models of Solids, Liquids, and Gases",
					content: [
						"**Concept path:** Solids, liquids, and gases differ by particle arrangement, spacing, attraction, and motion. State labels describe behavior under current conditions rather than permanent identity.",
						"**Remote investigation:** Use the PhET States of Matter simulation to compare particle motion in a solid, liquid, and gas. Focus on spacing, vibration, freedom of movement, and how energy changes the model.",
						"**Output:** Three particle diagrams with one sentence explaining each state.",
						"**CER checkpoint:** Use simulation evidence to explain why gases expand to fill available space while solids keep shape."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				},
				{
					title: "Physical Change and Conservation of Substance",
					content: [
						"**Concept path:** A physical change can alter form, size, state, or distribution without creating a new substance. Dissolving, melting, freezing, condensing, cutting, and mixing need careful evidence before being called chemical reactions.",
						"**Remote-safe activity:** Compare cards showing melting ice, tearing paper, dissolving sugar, filtering sand from water, and boiling water. Decide which property changes and what stays chemically the same.",
						"**Output:** A physical-change table with columns for visible change, particle-level change, and unchanged substance.",
						"**CER checkpoint:** Explain why a dramatic visible change is not automatically a chemical reaction."
					].join("\n\n")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Mystery Matter Sorting",
					content: [
						"**Project goal:** Sort a set of mystery cards using only properties and composition clues. Each card should be classified as element, compound, homogeneous mixture, heterogeneous mixture, or not enough information.",
						"**Requirements:** Write the decision rule before sorting. Every classification needs one evidence sentence.",
						"**Completion checks:** At least two cards include uncertainty notes, and the final answer distinguishes physical property evidence from composition evidence."
					].join("\n\n")
				},
				{
					title: "Project: State-of-Matter Simulation Report",
					content: [
						"**Project goal:** Use the States of Matter simulation to explain how particle motion changes across states and during heating or cooling.",
						"**Requirements:** Include three screenshots or sketches, one particle-motion comparison, one changed-condition prediction, and one limitation of the simulation.",
						"**Completion checks:** The report uses the terms particle, motion, spacing, attraction, energy, and state accurately."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				}
			]
		},
		{
			title: "CHM2 Atomic Structure, Isotopes, and Ions",
			curriculum: [
				{
					title: "Protons, Neutrons, Electrons, and Atomic Identity",
					content: [
						"**Concept path:** Protons define the element, neutrons affect isotope and mass number, and electrons affect charge and bonding behavior. Atomic number is the number of protons, not the total number of particles.",
						"**Remote investigation:** Use the PhET Build an Atom simulation to change protons, neutrons, and electrons separately. Track which changes alter element identity, isotope, mass number, and charge.",
						"**Output:** A particle-change table with rows for adding a proton, adding a neutron, adding an electron, and removing an electron.",
						"**CER checkpoint:** Explain why changing proton count is more identity-changing than changing electron count."
					].join("\n\n"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Isotopes and Average Atomic Mass",
					content: [
						"**Concept path:** Isotopes are atoms of the same element with different numbers of neutrons. The atomic mass shown on a periodic table is an average based on isotope abundance, not usually the mass number of a single atom.",
						"**Remote-safe activity:** Use a provided isotope table to compare carbon-12, carbon-13, and carbon-14. Then use a small weighted-average example with simplified percentages.",
						"**Output:** A short calculation and one explanation sentence distinguishing mass number from average atomic mass.",
						"**CER checkpoint:** Explain why two atoms can both be carbon even if their masses differ."
					].join("\n\n")
				},
				{
					title: "Ions and Charge",
					content: [
						"**Concept path:** An ion forms when an atom or group of atoms has unequal protons and electrons. Losing electrons produces a positive ion; gaining electrons produces a negative ion. The nucleus does not usually change during ordinary ion formation.",
						"**Remote-safe activity:** Build neutral atoms and ions from particle counts. For each example, calculate charge as protons minus electrons.",
						"**Output:** Five particle-count problems with element name, isotope notation when needed, and charge.",
						"**CER checkpoint:** Explain why a sodium ion is still sodium after losing an electron."
					].join("\n\n"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Reading Atomic Notation",
					content: [
						"**Concept path:** Atomic notation packs element symbol, atomic number, mass number, and charge into a compact form. Reading notation correctly prevents confusion between isotope identity and ion charge.",
						"**Remote-safe activity:** Translate between notation, particle counts, and plain-language descriptions. Include neutral atoms, positive ions, negative ions, and isotopes.",
						"**Output:** A notation translation table with at least six examples.",
						"**CER checkpoint:** Explain which number identifies the element and which number identifies the isotope."
					].join("\n\n"),
					mediaLink: SIMULATIONS.buildAtom
				}
			],
			supplementalProjects: [
				{
					title: "Project: Atom Builder Challenge",
					content: [
						"**Project goal:** Create a challenge set for atomic structure using particle counts. Each challenge should specify a target identity, isotope, or charge and require a built atom or ion.",
						"**Requirements:** Include at least eight challenges: two neutral atoms, two isotopes, two positive ions, and two negative ions.",
						"**Completion checks:** Every answer includes proton, neutron, electron, mass number, atomic number, and charge evidence."
					].join("\n\n"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Project: Isotope Claim Check",
					content: [
						"**Project goal:** Analyze three statements about isotopes and decide whether each is accurate, misleading, or false.",
						"**Requirements:** Each decision needs a corrected statement and a short explanation using protons, neutrons, mass number, and atomic number.",
						"**Completion checks:** At least one correction addresses the misconception that different isotopes are different elements."
					].join("\n\n")
				}
			]
		},
		{
			title: "CHM3 Periodic Table and Trends",
			curriculum: [
				{
					title: "Reading the Periodic Table",
					content: [
						"**Concept path:** The periodic table organizes elements by atomic number and recurring properties. Element boxes commonly show symbol, name, atomic number, and atomic mass, and the table layout helps predict similarities.",
						"**Remote-safe activity:** Use the ACS periodic table to read element boxes for hydrogen, carbon, oxygen, sodium, chlorine, iron, and neon. Record symbol, atomic number, approximate atomic mass, and one property or use.",
						"**Output:** A seven-element table and one sentence explaining the difference between atomic number and atomic mass.",
						"**CER checkpoint:** Explain why the periodic table is an evidence tool, not only a memorization chart."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Groups, Periods, Metals, Nonmetals, and Metalloids",
					content: [
						"**Concept path:** Columns are groups, rows are periods, and broad table regions help predict physical and chemical behavior. Metals, nonmetals, metalloids, halogens, alkali metals, alkaline earth metals, and noble gases introduce useful categories.",
						"**Remote-safe activity:** Color-code a blank periodic table by major regions and write one evidence-based property statement for each region.",
						"**Output:** A region map and a vocabulary glossary for group, period, metal, nonmetal, metalloid, halogen, and noble gas.",
						"**CER checkpoint:** Use table position to predict whether an unfamiliar element is more likely to behave like a metal or nonmetal."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Valence Electrons and Reactivity Patterns",
					content: [
						"**Concept path:** Valence electrons are outer-shell electrons involved in bonding and reactivity. Main-group elements in the same group often share valence patterns, which helps explain similar chemical behavior.",
						"**Remote-safe activity:** Compare lithium, sodium, and potassium; fluorine, chlorine, and bromine; and helium, neon, and argon. Record what their group position suggests about reactivity.",
						"**Output:** A group-pattern table that links position, valence idea, and predicted behavior.",
						"**CER checkpoint:** Explain why noble gases are often less reactive than nearby elements."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Trend Reasoning Without Memorizing Every Detail",
					content: [
						"**Concept path:** Trends such as atomic radius, ionization energy, electronegativity, and metallic character describe patterns across the table. Introductory work should focus on reading and interpreting trends, not memorizing every exception.",
						"**Remote-safe activity:** Use a trend diagram or table to compare two elements. Decide which has a larger atomic radius or stronger attraction for electrons and explain the evidence source.",
						"**Output:** Three trend comparison answers with a one-sentence justification each.",
						"**CER checkpoint:** Explain how table position can support a prediction even when exact numerical data is not known."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				}
			],
			supplementalProjects: [
				{
					title: "Project: Element Profile Cards",
					content: [
						"**Project goal:** Build profile cards for six elements from different table regions. Each card should include symbol, atomic number, atomic mass, region, common use, and one property-based prediction.",
						"**Requirements:** At least one element must be a metal, one nonmetal, one noble gas, and one halogen.",
						"**Completion checks:** The final comparison explains one similarity within a group and one difference across a period."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Project: Periodic Trend Argument",
					content: [
						"**Project goal:** Choose three element pairs and make a short argument about a periodic trend for each pair.",
						"**Requirements:** Each argument must identify the trend, cite table position or provided trend data, and explain the reasoning in plain language.",
						"**Completion checks:** The work avoids unsupported claims such as nearby elements are always identical."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				}
			]
		},
		{
			title: "CHM4 Bonding, Formulas, and Molecular Structure",
			curriculum: [
				{
					title: "Why Atoms Bond",
					content: [
						"**Concept path:** Bonding lowers or redistributes energy through attractions between charged particles. Introductory bonding focuses on valence electrons, stable arrangements, ionic attraction, and shared-electron covalent bonding.",
						"**Remote-safe activity:** Compare sodium chloride, water, oxygen gas, and carbon dioxide. Identify whether the examples are better described by ionic or covalent bonding at an introductory level.",
						"**Output:** A bonding comparison table with bond type, particle-level attraction, formula, and one property prediction.",
						"**CER checkpoint:** Explain why a chemical formula gives a composition pattern but not a full 3D structure."
					].join("\n\n")
				},
				{
					title: "Ionic Compounds and Formula Units",
					content: [
						"**Concept path:** Ionic compounds form from patterns of positive and negative ions. A formula unit shows the simplest whole-number ratio needed for total charge balance.",
						"**Remote-safe activity:** Use ion cards to build neutral formulas such as NaCl, MgCl2, Al2O3, and CaF2. Balance total positive and negative charge before writing the formula.",
						"**Output:** Six ionic formula examples with charge-balance evidence.",
						"**CER checkpoint:** Explain why MgCl2 needs two chloride ions for one magnesium ion."
					].join("\n\n")
				},
				{
					title: "Covalent Molecules and Lewis-Style Thinking",
					content: [
						"**Concept path:** Covalent molecules share electron pairs between nonmetal atoms. Lewis-style diagrams help track valence electrons and bonding patterns without requiring advanced quantum detail.",
						"**Remote-safe activity:** Sketch simple dot or line structures for H2, O2, H2O, CO2, CH4, and NH3. Count bonds and lone pairs where appropriate.",
						"**Output:** A molecule sketch set with formula, atom count, bonds, and one limitation of the drawing.",
						"**CER checkpoint:** Explain why water and carbon dioxide have different shapes even though both contain three atoms."
					].join("\n\n")
				},
				{
					title: "Molecular Shape and Polarity",
					content: [
						"**Concept path:** Molecule shape depends on bonded atoms and lone pairs around a central atom. Shape influences polarity and therefore affects properties such as dissolving, boiling point, and interactions with other molecules.",
						"**Remote investigation:** Use the PhET Molecule Shapes simulation to compare linear, bent, trigonal planar, and tetrahedral arrangements. Record how lone pairs change shape.",
						"**Output:** Four shape sketches with central atom, bonded atoms, lone pairs, and a simple polarity prediction.",
						"**CER checkpoint:** Use simulation evidence to explain why electron groups repel and spread out."
					].join("\n\n"),
					mediaLink: SIMULATIONS.moleculeShapes
				}
			],
			supplementalProjects: [
				{
					title: "Project: Formula and Bonding Card Sort",
					content: [
						"**Project goal:** Sort formulas into ionic compounds, covalent molecules, and uncertain cases using element type, charge patterns, and formula clues.",
						"**Requirements:** Include at least twelve formulas and write one rule used for each category.",
						"**Completion checks:** The sort includes at least two uncertain cases and explains what extra evidence would be needed."
					].join("\n\n")
				},
				{
					title: "Project: Molecule Shape Gallery",
					content: [
						"**Project goal:** Build a gallery of simple molecule shapes using sketches from the simulation or a diagram. Each gallery entry should connect shape to one possible property consequence.",
						"**Requirements:** Include at least five molecules and at least three different shape categories.",
						"**Completion checks:** Every entry names bonded atoms, lone pairs if relevant, shape, and one limitation of the model."
					].join("\n\n"),
					mediaLink: SIMULATIONS.moleculeShapes
				}
			]
		},
		{
			title: "CHM5 Energy, Phase Change, and Intermolecular Forces",
			curriculum: [
				{
					title: "Temperature, Thermal Energy, and Particle Motion",
					content: [
						"**Concept path:** Temperature relates to average particle motion, while thermal energy depends on amount of matter and particle motion. The distinction matters when comparing small hot samples with larger cooler samples.",
						"**Remote investigation:** Use the States of Matter simulation to compare particle motion before and after heating or cooling. Describe changes in motion without claiming particles themselves get bigger.",
						"**Output:** A before/after particle-motion explanation with vocabulary for temperature, thermal energy, motion, and phase.",
						"**CER checkpoint:** Explain why heating usually increases particle motion."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				},
				{
					title: "Phase Changes and Energy Transfer",
					content: [
						"**Concept path:** Melting, freezing, vaporization, condensation, sublimation, and deposition are physical changes involving energy transfer and particle arrangement. The substance identity remains the same during ordinary phase change.",
						"**Remote-safe activity:** Interpret a heating or cooling curve. Identify where temperature changes, where phase changes occur, and where energy is changing particle arrangement rather than only average motion.",
						"**Output:** An annotated heating curve with phase labels and energy-transfer notes.",
						"**CER checkpoint:** Explain why a flat section of a heating curve can still involve energy transfer."
					].join("\n\n")
				},
				{
					title: "Intermolecular Attractions",
					content: [
						"**Concept path:** Attractions between particles influence boiling point, evaporation, surface tension, viscosity, and solubility. Introductory work focuses on comparing stronger and weaker attractions rather than memorizing advanced categories.",
						"**Remote-safe activity:** Compare water, carbon dioxide, and a simple oil-like molecule using provided descriptions or diagrams. Predict which substances are more likely to have higher boiling points or stronger attractions.",
						"**Output:** A property-prediction table connecting attraction strength to visible behavior.",
						"**CER checkpoint:** Explain why molecular structure can affect a bulk property such as boiling point."
					].join("\n\n")
				},
				{
					title: "Phase Diagrams as Maps of Conditions",
					content: [
						"**Concept path:** A phase diagram shows which state is stable at combinations of temperature and pressure. It is a map of conditions, not a picture of particles.",
						"**Remote-safe activity:** Read a simplified phase diagram and identify solid, liquid, gas, melting, boiling, and sublimation regions. Compare what changes when pressure increases or temperature decreases.",
						"**Output:** Three phase-diagram coordinate questions and one changed-condition prediction.",
						"**CER checkpoint:** Explain why pressure can matter for phase, not only temperature."
					].join("\n\n")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Heating Curve Explanation",
					content: [
						"**Project goal:** Explain a heating curve as both a graph and a particle story.",
						"**Requirements:** Label each region, describe particle motion or arrangement, and state where phase changes occur.",
						"**Completion checks:** The explanation distinguishes temperature change from energy transfer and does not claim that phase change creates a new substance."
					].join("\n\n")
				},
				{
					title: "Project: Property Prediction from Attractions",
					content: [
						"**Project goal:** Use particle attraction evidence to predict which of several substances will evaporate, boil, or dissolve more readily.",
						"**Requirements:** Use provided property cards or diagrams. Each prediction needs a claim, evidence, and reasoning.",
						"**Completion checks:** The work names uncertainty where the provided evidence is incomplete."
					].join("\n\n")
				}
			]
		},
		{
			title: "CHM6 Chemical Reactions and Conservation",
			curriculum: [
				{
					title: "Reactants, Products, and Evidence of Chemical Change",
					content: [
						"**Concept path:** A chemical reaction rearranges atoms into new substances. Evidence can include gas production, temperature change, color change, light, precipitate formation, or new properties, but evidence must be interpreted carefully.",
						"**Remote-safe activity:** Classify provided examples as likely physical change, likely chemical change, or not enough evidence. Include rusting, burning fuel, dissolving sugar, mixing salt and water, and a gas-forming reaction diagram.",
						"**Output:** A classification table with evidence and uncertainty notes.",
						"**CER checkpoint:** Explain why bubbling can be strong evidence in one context and weak evidence in another."
					].join("\n\n")
				},
				{
					title: "Conservation of Matter and Balancing Equations",
					content: [
						"**Concept path:** Chemical equations must conserve atoms. Coefficients change the number of particles or formula units; subscripts are part of the substance identity and cannot be changed during balancing.",
						"**Remote investigation:** Use the PhET Balancing Chemical Equations simulation to balance simple reactions and compare particle, bar chart, and scale views.",
						"**Output:** Five balanced equations with atom counts before and after.",
						"**CER checkpoint:** Explain why changing a subscript is not a valid way to balance an equation."
					].join("\n\n"),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Reaction Types and Patterns",
					content: [
						"**Concept path:** Reaction types such as synthesis, decomposition, single replacement, double replacement, combustion, precipitation, and acid-base reaction describe patterns that help predict products and organize evidence.",
						"**Remote-safe activity:** Sort example equations by reaction pattern. The goal is pattern recognition and evidence, not advanced prediction rules.",
						"**Output:** A reaction-type chart with one reason for each classification.",
						"**CER checkpoint:** Explain how a reaction type helps summarize what changed."
					].join("\n\n")
				},
				{
					title: "Limiting Reactants and Leftovers",
					content: [
						"**Concept path:** A reaction stops when one needed reactant runs out, leaving extra amounts of other reactants. Limiting-reactant reasoning is ratio reasoning applied to chemical formulas and equations.",
						"**Remote investigation:** Use the PhET Reactants, Products and Leftovers simulation to build sandwich-style analogies and chemical-reaction examples. Record which reactant limits production and what remains.",
						"**Output:** Three limiting-reactant scenarios with reactant amounts, product amount, limiting reactant, and leftovers.",
						"**CER checkpoint:** Explain why having more total pieces does not guarantee more product if the pieces are in the wrong ratio."
					].join("\n\n"),
					mediaLink: SIMULATIONS.reactions
				}
			],
			supplementalProjects: [
				{
					title: "Project: Equation Balancing Portfolio",
					content: [
						"**Project goal:** Build a portfolio of balanced equations that shows conservation of atoms through counts, particle diagrams, or bar charts.",
						"**Requirements:** Include at least eight equations, with at least two requiring coefficients greater than 2.",
						"**Completion checks:** Every equation includes before/after atom counts, and at least one mistake is corrected with an explanation."
					].join("\n\n"),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Project: Limiting Reactant Story Problem",
					content: [
						"**Project goal:** Create and solve a limiting-reactant problem using a food, craft, or particle analogy, then connect it to a real chemical equation.",
						"**Requirements:** Show the needed ratio, starting amounts, limiting reactant, product amount, and leftovers.",
						"**Completion checks:** The analogy and chemical example both use the same ratio logic."
					].join("\n\n"),
					mediaLink: SIMULATIONS.reactions
				}
			]
		},
		{
			title: "CHM7 Solutions, Concentration, and pH",
			curriculum: [
				{
					title: "Solutes, Solvents, and Solution Vocabulary",
					content: [
						"**Concept path:** A solution is a homogeneous mixture. The solute is dissolved, the solvent does the dissolving, and concentration describes how much solute is present relative to solution amount.",
						"**Remote-safe activity:** Classify solution examples such as salt water, sugar water, air, vinegar, and brass. Identify solute, solvent, and evidence for homogeneous mixture where possible.",
						"**Output:** A solution vocabulary chart with examples and non-examples.",
						"**CER checkpoint:** Explain why a clear liquid is not automatically a pure substance."
					].join("\n\n")
				},
				{
					title: "Concentration and Saturation",
					content: [
						"**Concept path:** Concentration compares solute amount to solution amount. A solution can be dilute, concentrated, unsaturated, saturated, or supersaturated depending on conditions and solubility.",
						"**Remote investigation:** Use the PhET Concentration simulation to change solute amount and solution volume. Watch how color intensity, concentration reading, and saturation state change.",
						"**Output:** A variable table showing how concentration changes when solute increases, solvent increases, or both change.",
						"**CER checkpoint:** Explain why adding water can lower concentration even though the solute has not disappeared."
					].join("\n\n"),
					mediaLink: SIMULATIONS.concentration
				},
				{
					title: "Molarity as a Quantitative Concentration",
					content: [
						"**Concept path:** Molarity is moles of solute per liter of solution. The idea connects particle amount to volume and prepares for later stoichiometry without requiring advanced calculations at first.",
						"**Remote investigation:** Use the PhET Molarity simulation to change moles of solute and liters of solution. Predict whether molarity rises, falls, or stays the same before reading the value.",
						"**Output:** Four molarity-change predictions with checked results.",
						"**CER checkpoint:** Explain why doubling both moles and volume can leave molarity unchanged."
					].join("\n\n"),
					mediaLink: SIMULATIONS.molarity
				},
				{
					title: "Acids, Bases, and pH",
					content: [
						"**Concept path:** pH describes how acidic or basic a solution is on a logarithmic scale. Introductory work focuses on interpreting the scale, identifying strong versus weak evidence, and avoiding unsafe tasting or mixing.",
						"**Remote investigation:** Use the PhET pH Scale simulation to compare common solutions, dilution, and pH values. Do not require physical pH testing or household chemical mixing.",
						"**Output:** A pH comparison table and one dilution prediction.",
						"**CER checkpoint:** Explain why lower pH means more acidic and why dilution usually moves pH toward neutral."
					].join("\n\n"),
					mediaLink: SIMULATIONS.phScale
				}
			],
			supplementalProjects: [
				{
					title: "Project: Concentration Investigation",
					content: [
						"**Project goal:** Use a simulation to investigate how concentration changes when solute amount and solution volume change.",
						"**Requirements:** Test at least six scenarios, record variables, and identify one pattern.",
						"**Completion checks:** The final CER response cites simulation evidence and uses solute, solvent, solution, concentration, dilute, and saturated accurately."
					].join("\n\n"),
					mediaLink: SIMULATIONS.concentration
				},
				{
					title: "Project: pH Scale Explanation",
					content: [
						"**Project goal:** Create a short guide to the pH scale using examples from the simulation.",
						"**Requirements:** Include acidic, neutral, and basic examples; one dilution example; and one safety note about not tasting or mixing unknown substances.",
						"**Completion checks:** The explanation separates pH evidence from unsafe or unsupported sensory claims."
					].join("\n\n"),
					mediaLink: SIMULATIONS.phScale
				}
			]
		},
		{
			title: "CHM8 Quantitative Chemistry: Moles and Stoichiometry Lite",
			curriculum: [
				{
					title: "Counting Particles with the Mole",
					content: [
						"**Concept path:** A mole is a counting unit for particles, similar in purpose to a dozen but much larger. It connects atomic-scale particles to measurable amounts of matter.",
						"**Remote-safe activity:** Compare counting by ones, dozens, pairs, and moles using simplified analogies. Then translate between number of moles and relative particle counts without requiring memorization-heavy calculation first.",
						"**Output:** A mole analogy card and three simple mole-to-particle reasoning examples.",
						"**CER checkpoint:** Explain why chemistry needs a counting unit larger than ordinary numbers."
					].join("\n\n")
				},
				{
					title: "Molar Mass and Unit Conversion",
					content: [
						"**Concept path:** Molar mass connects grams to moles. Periodic table masses provide the bridge from measurable lab-scale mass to particle-scale amount.",
						"**Remote-safe activity:** Calculate molar masses for H2O, CO2, NaCl, O2, and CaCO3 using a periodic table. Keep units visible at every step.",
						"**Output:** Five molar-mass calculations and two grams-to-moles conversions.",
						"**CER checkpoint:** Explain why molar mass depends on formula composition."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Mole Ratios from Balanced Equations",
					content: [
						"**Concept path:** Coefficients in a balanced equation create mole ratios. Stoichiometry uses those ratios to connect reactant amounts to product amounts.",
						"**Remote-safe activity:** Read a balanced equation and identify all usable mole ratios. Use simple one-step conversions before combining with grams.",
						"**Output:** Four mole-ratio problems with the ratio highlighted before calculation.",
						"**CER checkpoint:** Explain why unbalanced equations cannot support stoichiometry."
					].join("\n\n"),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Stoichiometry with Limits and Reasonableness",
					content: [
						"**Concept path:** A stoichiometry answer should be checked for units, balanced-equation ratio, limiting reactant when relevant, and reasonableness. The method matters as much as the number.",
						"**Remote-safe activity:** Solve two guided problems: one moles-to-moles and one grams-to-grams. Mark the equation, known value, conversion factor, target unit, and final reasonableness check.",
						"**Output:** Two fully annotated stoichiometry solutions.",
						"**CER checkpoint:** Explain why dimensional analysis is a reasoning tool rather than a formatting trick."
					].join("\n\n")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Molar Mass Reference Sheet",
					content: [
						"**Project goal:** Build a reference sheet that explains molar mass through examples instead of listing formulas alone.",
						"**Requirements:** Include at least eight compounds, show element-by-element contributions, and include one common mistake to avoid.",
						"**Completion checks:** Units are visible in every calculation, and the sheet explains why formulas determine molar mass."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Project: Stoichiometry Error Analysis",
					content: [
						"**Project goal:** Diagnose flawed stoichiometry solutions and repair them.",
						"**Requirements:** Analyze at least four errors: unbalanced equation, wrong mole ratio, missing unit conversion, and unreasonable final unit.",
						"**Completion checks:** Each repair states the exact error, the corrected step, and how to detect the same mistake next time."
					].join("\n\n")
				}
			]
		},
		{
			title: "CHM9 Capstone: Real-World Chemistry Explanation",
			curriculum: [
				{
					title: "Choosing a Chemistry Phenomenon",
					content: [
						"**Concept path:** A capstone phenomenon should be narrow enough to explain with course concepts and evidence. Good choices include corrosion, carbonation, water hardness, dissolving, air quality chemistry, battery basics, cooking chemistry, cleaning chemistry, or material properties.",
						"**Remote-safe activity:** Compare three possible capstone topics and score each for safety, available evidence, chemistry vocabulary, and scope.",
						"**Output:** A topic-selection table and a one-sentence research question.",
						"**CER checkpoint:** Explain why the selected topic can be studied without a required physical experiment."
					].join("\n\n")
				},
				{
					title: "Building the Evidence Set",
					content: [
						"**Concept path:** A strong chemistry explanation uses multiple evidence types: observation, diagram, data table, simulation, equation, or authoritative reference. The evidence must be relevant to the claim.",
						"**Remote-safe activity:** Gather or use provided evidence for the capstone topic. At least one source should be a diagram, simulation, or data table; at least one should be a written reference.",
						"**Output:** An evidence log with source, what it shows, how it supports the claim, and one limitation.",
						"**CER checkpoint:** Reject one piece of weak evidence and explain why it does not support the claim."
					].join("\n\n")
				},
				{
					title: "Writing the Chemistry Explanation",
					content: [
						"**Concept path:** A complete explanation connects vocabulary, particle model, equation or formula when relevant, data/evidence, and a changed-condition prediction. The explanation should be understandable without relying on private notes.",
						"**Remote-safe activity:** Draft a CER-based capstone explanation. Use course concepts from at least four modules, such as atoms, periodic table, bonding, phase change, reactions, solutions, or stoichiometry.",
						"**Output:** A structured explanation with claim, evidence, reasoning, model, vocabulary, and prediction sections.",
						"**CER checkpoint:** Check whether every claim has evidence and whether every vocabulary term is used accurately."
					].join("\n\n")
				},
				{
					title: "Presentation, Revision, and Reflection",
					content: [
						"**Concept path:** Scientific communication improves through revision. A good final version states the question, explains the model, cites evidence, names uncertainty, and shows what would be tested next.",
						"**Remote-safe activity:** Present the capstone as slides, a short written report, or an annotated notebook page. Revise after feedback by strengthening evidence, clarifying vocabulary, or narrowing the claim.",
						"**Output:** A final capstone artifact and a short reflection naming one strengthened idea and one remaining question.",
						"**CER checkpoint:** Explain what evidence would change the conclusion."
					].join("\n\n")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Chemistry Phenomenon Capstone",
					content: [
						"**Project goal:** Explain one real-world chemistry phenomenon using course concepts, evidence, and a particle-level model.",
						"**Requirements:** Include a claim, evidence log, particle/model explanation, at least four course vocabulary terms, one diagram or simulation reference, one changed-condition prediction, and one limitation.",
						"**Completion checks:** The final artifact is self-contained, source-backed, remote-safe, and specific enough to be corrected or challenged."
					].join("\n\n")
				},
				{
					title: "Project: Capstone Peer Review",
					content: [
						"**Project goal:** Review a capstone explanation using a rubric for claim clarity, evidence quality, chemistry accuracy, model use, safety, and next-step reasoning.",
						"**Requirements:** Provide at least two strengths, two revision targets, and one question that would improve the investigation.",
						"**Completion checks:** Feedback references the artifact directly and avoids vague comments such as good job or add more detail without naming what detail is missing."
					].join("\n\n"),
					datasetLink: REFERENCES.ngssAppendices
				}
			]
		},
		{
			title: "CHM10 Chemistry Resource Bank",
			curriculum: [
				{
					title: "Core Chemistry References",
					content: [
						"**Resource bank:** Use the ACS Chemistry Guidelines, ACS periodic table, NIST SI units page, and NGSS appendices as reference material for standards, safety boundaries, periodic-table reading, units, and evidence practices.",
						"**Use:** These links are not separate assignments by default. They support the specific lessons and projects that cite them.",
						"**Completion check:** Any reference used in a project should be named in the evidence log with a short note explaining what it contributed."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines
				},
				{
					title: "Simulation Set",
					content: [
						"**Resource bank:** The course uses PhET simulations for atoms, states of matter, molecule shapes, balancing equations, limiting reactants, concentration, molarity, and pH.",
						"**Use:** A simulation counts as evidence only when a specific setting, observation, or screenshot is connected to a claim.",
						"**Completion check:** Simulation-based work should include the variable changed, what was observed, and what the observation supports."
					].join("\n\n"),
					mediaLink:
						"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry"
				},
				{
					title: "Remote-Safe Investigation Checklist",
					content: [
						"**Resource bank:** Required work can be completed with a browser, notes, diagrams, screenshots, tables, and writing. Optional household observations are replaceable with provided evidence or simulations.",
						"**Use:** Before a project begins, identify the phenomenon, evidence source, vocabulary target, model, and final CER prompt.",
						"**Completion check:** The task does not require beakers, kits, unknown chemicals, heat, pressure buildup, electrical components, ingestion, outdoor collection, or parent-managed materials."
					].join("\n\n")
				},
				{
					title: "Chemistry Explanation Rubric",
					content: [
						"**Resource bank:** Strong explanations are assessed by claim clarity, evidence relevance, particle-model reasoning, accurate vocabulary, safe scope, and changed-condition prediction.",
						"**Use:** Apply the rubric to project drafts before final submission. A weak explanation usually needs a narrower claim, better evidence, or a clearer model.",
						"**Completion check:** The final work can answer: What is the claim? What evidence supports it? What particle-level model explains it? What would change under a new condition?"
					].join("\n\n")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simulation Evidence Log",
					content: [
						"**Project goal:** Build a reusable evidence log for one PhET chemistry simulation.",
						"**Requirements:** Include simulation name, variables changed, screenshots or sketches, observations, claim, evidence, reasoning, and limitation.",
						"**Completion checks:** The log identifies exactly what the simulation shows and does not treat the simulation as proof without explanation."
					].join("\n\n"),
					mediaLink:
						"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry"
				},
				{
					title: "Project: Chemistry Reference Card",
					content: [
						"**Project goal:** Create a concise reference card for one recurring chemistry tool: periodic table, units, CER, particle diagrams, balancing equations, or pH scale.",
						"**Requirements:** Include the tool's purpose, how to read it, one example, one common mistake, and one link to a supporting reference.",
						"**Completion checks:** The card is useful during a later project without needing a separate explanation."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				}
			]
		}
	]
};
