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

const MATERIALS = {
	answerKey: "/course-assets/chemistry/chemistry-rubrics-answer-key.md",
	pack: "/course-assets/chemistry/chemistry-materials-pack.md"
} as const;

function material(section: string) {
	return `${MATERIALS.pack}#${section}`;
}

function answerKey(section: string) {
	return `${MATERIALS.answerKey}#${section}`;
}

export const introToChemistryCourse: RawCourse = {
	name: "Intro to Chemistry",
	modules: [
		{
			title: "CHM1 Workflow, Safety, Measurement, and Models",
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
						"**Remote-safe activity:** Compare the measurement tables in the materials pack. Identify which table is easiest to interpret, which table can be repaired by unit conversion, and which table lacks enough context to support a chemistry conclusion.",
						"**Worked example:** A mass of `0.0248 kg` and a volume of `25.0 mL` cannot be compared directly to grams and milliliters until the mass is converted to `24.8 g`. The number is not the only data; the unit is part of the measurement.",
						"**Output:** A corrected table with units, one converted value, and one note explaining why unit labels matter.",
						"**CER checkpoint:** Explain how an unlabeled number can produce a wrong chemistry conclusion even when the arithmetic is correct."
					].join("\n\n"),
					datasetLink: material(
						"measurement-tables-and-unit-conversions"
					),
					solutionLink: answerKey("measurement-tables-key")
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
						"**Requirements:** Use one everyday phenomenon supplied by the course material. No household experiment is required; a photo, diagram, simulation screenshot, or provided data table is enough. The page should explicitly label what was observed, what was inferred, and what model explains the difference.",
						"**Example direction:** Melting ice can be described visibly as a shape/state change, but the chemistry explanation should describe particle motion, spacing, and identity. The prediction can change temperature, pressure, or amount of matter.",
						"**Completion checks:** The page separates observation from inference, includes units where numbers appear, and ends with a testable prediction."
					].join("\n\n"),
					datasetLink: material(
						"measurement-tables-and-unit-conversions"
					),
					solutionLink: answerKey("general-cer-rubric")
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
			title: "CHM2 Matter, Classification, and Particle Models",
			curriculum: [
				{
					title: "Matter, Properties, and Classification",
					content: [
						"**Concept path:** Matter has mass and takes up space. Substances can be described by physical properties such as density, melting point, boiling point, color, conductivity, solubility, and state at room temperature.",
						"**Remote-safe activity:** Sort the matter and classification cards into matter and non-matter, then classify matter examples by observable properties. Use property evidence rather than personal familiarity.",
						"**Worked example:** Light from a lamp can affect matter, but it is not classified as a material sample in this activity because the prompt asks for things with mass and volume. Salt water is matter, but its category depends on composition rather than just appearance.",
						"**Output:** A classification chart that distinguishes object, material, property, and evidence.",
						"**CER checkpoint:** Make a claim about whether an example counts as matter and support it with mass/space reasoning."
					].join("\n\n"),
					datasetLink: material("matter-and-classification-cards"),
					solutionLink: answerKey("matter-and-classification-key")
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
						"**Remote-safe activity:** Compare the physical and chemical change cards. Decide which property changes, what stays chemically the same, and what evidence would be needed before calling the change a reaction.",
						"**Worked example:** Bubbling during boiling is not the same evidence as bubbling during a gas-forming reaction. The same visible clue can mean different things depending on the particle-level process.",
						"**Output:** A physical-change table with columns for visible change, particle-level change, and unchanged substance.",
						"**CER checkpoint:** Explain why a dramatic visible change is not automatically a chemical reaction."
					].join("\n\n"),
					datasetLink: material("physical-and-chemical-change-cards"),
					solutionLink: answerKey("physical-and-chemical-change-key")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Mystery Matter Sorting",
					content: [
						"**Project goal:** Sort a set of mystery cards using only properties and composition clues. Each card should be classified as element, compound, homogeneous mixture, heterogeneous mixture, or not enough information.",
						"**Requirements:** Write the decision rule before sorting. Every classification needs one evidence sentence. At least two cards should be intentionally uncertain so the final product practices saying what evidence is missing instead of guessing.",
						"**Example direction:** A clear liquid is not automatically a pure substance; it could be water, salt water, vinegar, or many other homogeneous mixtures.",
						"**Completion checks:** At least two cards include uncertainty notes, and the final answer distinguishes physical property evidence from composition evidence."
					].join("\n\n"),
					datasetLink: material("matter-and-classification-cards"),
					solutionLink: answerKey("matter-and-classification-key")
				},
				{
					title: "Project: State-of-Matter Simulation Report",
					content: [
						"**Project goal:** Use the States of Matter simulation to explain how particle motion changes across states and during heating or cooling.",
						"**Requirements:** Include three screenshots or sketches, one particle-motion comparison, one changed-condition prediction, and one limitation of the simulation. The report should compare a solid, liquid, and gas using the same substance when possible so the change in motion and spacing is not confused with changing the identity of the particles.",
						"**Analysis target:** Explain why heating changes motion before it changes the substance's chemical identity. If the simulation shows particles separating during evaporation, connect that observation to state change rather than bond breaking inside the particles.",
						"**Completion checks:** The report uses the terms particle, motion, spacing, attraction, energy, and state accurately, and each image is tied to a specific claim rather than included as decoration."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				}
			]
		},
		{
			title: "CHM3 Atomic Structure, Isotopes, and Ions",
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
						"**Remote-safe activity:** Use the isotope table in the materials pack to compare carbon-12, carbon-13, carbon-14, chlorine-35, and chlorine-37. Then use a small weighted-average example with simplified percentages.",
						"**Worked example:** Chlorine-35 at 75% and chlorine-37 at 25% produces an average near `35.5`, which is why a periodic table mass is not usually a whole-number mass number.",
						"**Output:** A short calculation and one explanation sentence distinguishing mass number from average atomic mass.",
						"**CER checkpoint:** Explain why two atoms can both be carbon even if their masses differ."
					].join("\n\n"),
					datasetLink: material("isotope-table"),
					solutionLink: answerKey("isotope-key")
				},
				{
					title: "Ions and Charge",
					content: [
						"**Concept path:** An ion forms when an atom or group of atoms has unequal protons and electrons. Losing electrons produces a positive ion; gaining electrons produces a negative ion. The nucleus does not usually change during ordinary ion formation.",
						"**Remote-safe activity:** Build neutral atoms and ions from particle counts, then use the ion cards to connect charge to formula writing. For each particle-count example, calculate charge as protons minus electrons.",
						"**Worked example:** Sodium has 11 protons. If it has 10 electrons, the charge is `11 - 10 = +1`, so it is a sodium ion rather than a different element.",
						"**Output:** Five particle-count problems with element name, isotope notation when needed, and charge.",
						"**CER checkpoint:** Explain why a sodium ion is still sodium after losing an electron."
					].join("\n\n"),
					datasetLink: material("ion-and-formula-cards"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Reading Atomic Notation",
					content: [
						"**Concept path:** Atomic notation packs element symbol, atomic number, mass number, and charge into a compact form. Reading notation correctly prevents confusion between isotope identity and ion charge.",
						"**Remote-safe activity:** Translate between notation, particle counts, and plain-language descriptions. Include neutral atoms, positive ions, negative ions, and isotopes from the materials pack.",
						"**Worked example:** Carbon-14 has 6 protons and 8 neutrons. If it is neutral, it has 6 electrons; if the charge changes, the electron count changes but the proton count still identifies carbon.",
						"**Output:** A notation translation table with at least six examples.",
						"**CER checkpoint:** Explain which number identifies the element and which number identifies the isotope."
					].join("\n\n"),
					datasetLink: material("isotope-table"),
					mediaLink: SIMULATIONS.buildAtom
				}
			],
			supplementalProjects: [
				{
					title: "Project: Atom Builder Challenge",
					content: [
						"**Project goal:** Create a challenge set for atomic structure using particle counts. Each challenge should specify a target identity, isotope, or charge and require a built atom or ion.",
						"**Requirements:** Include at least eight challenges: two neutral atoms, two isotopes, two positive ions, and two negative ions. Each challenge should include both a Build an Atom screenshot/sketch and the arithmetic used to determine identity, mass number, or charge.",
						"**Completion checks:** Every answer includes proton, neutron, electron, mass number, atomic number, and charge evidence."
					].join("\n\n"),
					datasetLink: material("isotope-table"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Project: Isotope Claim Check",
					content: [
						"**Project goal:** Analyze three statements about isotopes and decide whether each is accurate, misleading, or false.",
						"**Requirements:** Each decision needs a corrected statement and a short explanation using protons, neutrons, mass number, and atomic number. At least one statement should confuse isotope identity with ion charge, and at least one should confuse mass number with average atomic mass.",
						"**Completion checks:** At least one correction addresses the misconception that different isotopes are different elements."
					].join("\n\n"),
					datasetLink: material("isotope-table"),
					solutionLink: answerKey("isotope-key")
				}
			]
		},
		{
			title: "CHM4 Periodic Table and Trends",
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
						"**Remote-safe activity:** Use the periodic trend mini table to compare two elements. Decide which has a larger atomic radius or stronger attraction for electrons and explain the evidence source.",
						"**Worked example:** Sodium is below lithium in group 1, so the simplified trend table supports predicting a larger atomic radius for sodium. Fluorine is far to the right in period 2, so it is modeled as strongly attracting electrons.",
						"**Output:** Three trend comparison answers with a one-sentence justification each.",
						"**CER checkpoint:** Explain how table position can support a prediction even when exact numerical data is not known."
					].join("\n\n"),
					datasetLink: material("periodic-trend-mini-table"),
					solutionLink: answerKey("periodic-trend-key")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Element Profile Cards",
					content: [
						"**Project goal:** Build profile cards for six elements from different table regions. Each card should include symbol, atomic number, atomic mass, region, common use, and one property-based prediction.",
						"**Requirements:** At least one element must be a metal, one nonmetal, one noble gas, and one halogen. Each card should include one claim about expected behavior and one source note from the ACS periodic table or trend mini table.",
						"**Completion checks:** The final comparison explains one similarity within a group and one difference across a period."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Project: Periodic Trend Argument",
					content: [
						"**Project goal:** Choose three element pairs and make a short argument about a periodic trend for each pair.",
						"**Requirements:** Each argument must identify the trend, cite table position or provided trend data, and explain the reasoning in plain language. Include one pair across a period, one pair down a group, and one pair where the prediction should be stated cautiously.",
						"**Completion checks:** The work avoids unsupported claims such as nearby elements are always identical."
					].join("\n\n"),
					datasetLink: material("periodic-trend-mini-table"),
					solutionLink: answerKey("periodic-trend-key")
				}
			]
		},
		{
			title: "CHM5 Bonding, Formulas, and Molecular Structure",
			curriculum: [
				{
					title: "Why Atoms Bond",
					content: [
						"**Concept path:** Bonding lowers or redistributes energy through attractions between charged particles. Introductory bonding focuses on valence electrons, stable arrangements, ionic attraction, and shared-electron covalent bonding.",
						"**Remote-safe activity:** Compare sodium chloride, water, oxygen gas, carbon dioxide, and methane from the bonding card set. Identify whether each example is better described by ionic or covalent bonding at an introductory level.",
						"**Worked example:** Sodium chloride is modeled as ionic because sodium and chlorine form charged particles that attract in a repeating structure. Water is modeled as covalent because hydrogen and oxygen share electrons in molecules.",
						"**Output:** A bonding comparison table with bond type, particle-level attraction, formula, and one property prediction.",
						"**CER checkpoint:** Explain why a chemical formula gives a composition pattern but not a full 3D structure."
					].join("\n\n"),
					datasetLink: material("bonding-and-formula-cards"),
					solutionLink: answerKey("bonding-and-formula-key")
				},
				{
					title: "Ionic Compounds and Formula Units",
					content: [
						"**Concept path:** Ionic compounds form from patterns of positive and negative ions. A formula unit shows the simplest whole-number ratio needed for total charge balance.",
						"**Remote-safe activity:** Use the ion cards to build neutral formulas such as NaCl, MgCl2, Al2O3, CaF2, and NH4NO3. Balance total positive and negative charge before writing the formula.",
						"**Worked example:** Aluminum is `+3` and oxide is `-2`, so the smallest neutral ratio is two aluminum ions and three oxide ions: `Al2O3`.",
						"**Output:** Six ionic formula examples with charge-balance evidence.",
						"**CER checkpoint:** Explain why MgCl2 needs two chloride ions for one magnesium ion."
					].join("\n\n"),
					datasetLink: material("ion-and-formula-cards"),
					solutionLink: answerKey("ion-formula-key")
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
						"**Requirements:** Include at least twelve formulas and write one rule used for each category. The sort should include formula units, molecules, and at least two cases where the formula alone is not enough to support a confident claim.",
						"**Completion checks:** The sort includes at least two uncertain cases and explains what extra evidence would be needed."
					].join("\n\n"),
					datasetLink: material("bonding-and-formula-cards"),
					solutionLink: answerKey("bonding-and-formula-key")
				},
				{
					title: "Project: Molecule Shape Gallery",
					content: [
						"**Project goal:** Build a gallery of simple molecule shapes using sketches from the simulation or a diagram. Each gallery entry should connect shape to one possible property consequence.",
						"**Requirements:** Include at least five molecules and at least three different shape categories. For each entry, show the Lewis-style electron regions or simulation setup used to decide the shape, then write one sentence explaining why the molecule is not simply flat because it is drawn on paper.",
						"**Analysis target:** Distinguish formula, structure, and shape. For example, a formula can identify the atoms present, but it does not automatically show the three-dimensional arrangement or the distribution of electron regions.",
						"**Completion checks:** Every entry names bonded atoms, lone pairs if relevant, shape, and one limitation of the model."
					].join("\n\n"),
					mediaLink: SIMULATIONS.moleculeShapes
				}
			]
		},
		{
			title: "CHM6 Energy, Phase Change, and Intermolecular Forces",
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
						"**Remote-safe activity:** Interpret the heating curve data in the materials pack. Identify where temperature changes, where phase changes occur, and where energy is changing particle arrangement rather than only average motion.",
						"**Worked example:** During a flat section at 100 C, the sample can still absorb energy while boiling. The temperature does not rise because the energy is changing state, not simply increasing average particle speed.",
						"**Output:** An annotated heating curve with phase labels and energy-transfer notes.",
						"**CER checkpoint:** Explain why a flat section of a heating curve can still involve energy transfer."
					].join("\n\n"),
					datasetLink: material("heating-curve-data"),
					solutionLink: answerKey("heating-curve-key")
				},
				{
					title: "Intermolecular Attractions",
					content: [
						"**Concept path:** Attractions between particles influence boiling point, evaporation, surface tension, viscosity, and solubility. Introductory work focuses on comparing stronger and weaker attractions rather than memorizing advanced categories.",
						"**Remote-safe activity:** Compare water, carbon dioxide, ethanol, and a hexane-like oil model using the intermolecular property cards. Predict which substances are more likely to have higher boiling points, evaporate faster, or mix with water.",
						"**Worked example:** Water is predicted to have stronger attractions than carbon dioxide under ordinary conditions, so it has a much higher boiling point. That prediction comes from attraction evidence, not from color or familiarity.",
						"**Output:** A property-prediction table connecting attraction strength to visible behavior.",
						"**CER checkpoint:** Explain why molecular structure can affect a bulk property such as boiling point."
					].join("\n\n"),
					datasetLink: material("intermolecular-property-cards"),
					solutionLink: answerKey("intermolecular-property-key")
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
						"**Requirements:** Label each region, describe particle motion or arrangement, and state where phase changes occur. Include at least one sentence explaining why energy transfer can continue while the temperature is flat.",
						"**Completion checks:** The explanation distinguishes temperature change from energy transfer and does not claim that phase change creates a new substance."
					].join("\n\n"),
					datasetLink: material("heating-curve-data"),
					solutionLink: answerKey("heating-curve-key")
				},
				{
					title: "Project: Property Prediction from Attractions",
					content: [
						"**Project goal:** Use particle attraction evidence to predict which of several substances will evaporate, boil, or dissolve more readily.",
						"**Requirements:** Use the intermolecular property cards or diagrams. Each prediction needs a claim, evidence, and reasoning. At least one prediction should name a limitation, such as missing temperature, pressure, or structure detail.",
						"**Worked example:** A hexane-like oil is predicted not to mix well with water because the property card describes mostly nonpolar attractions. The claim should not overstate that all oils behave identically.",
						"**Completion checks:** The work names uncertainty where the provided evidence is incomplete."
					].join("\n\n"),
					datasetLink: material("intermolecular-property-cards"),
					solutionLink: answerKey("intermolecular-property-key")
				}
			]
		},
		{
			title: "CHM7 Chemical Reactions and Conservation",
			curriculum: [
				{
					title: "Reactants, Products, and Evidence of Chemical Change",
					content: [
						"**Concept path:** A chemical reaction rearranges atoms into new substances. Evidence can include gas production, temperature change, color change, light, precipitate formation, or new properties, but evidence must be interpreted carefully.",
						"**Remote-safe activity:** Classify the physical and chemical change cards as likely physical change, likely chemical change, or not enough evidence. Include rusting, burning fuel, dissolving sugar, mixing salt and water, and a gas-forming reaction diagram.",
						"**Worked example:** Bubbling is strong reaction evidence when a particle diagram shows new gas particles forming. It is weak evidence by itself when water is simply boiling.",
						"**Output:** A classification table with evidence and uncertainty notes.",
						"**CER checkpoint:** Explain why bubbling can be strong evidence in one context and weak evidence in another."
					].join("\n\n"),
					datasetLink: material("physical-and-chemical-change-cards"),
					solutionLink: answerKey("physical-and-chemical-change-key")
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
						"**Remote-safe activity:** Sort the reaction type cards by pattern. The goal is pattern recognition and evidence, not advanced prediction rules.",
						"**Worked example:** `CH4 + 2O2 -> CO2 + 2H2O` is combustion because a carbon-containing fuel reacts with oxygen and forms carbon dioxide and water.",
						"**Output:** A reaction-type chart with one reason for each classification.",
						"**CER checkpoint:** Explain how a reaction type helps summarize what changed."
					].join("\n\n"),
					datasetLink: material("reaction-type-cards"),
					solutionLink: answerKey("reaction-type-key")
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
						"**Requirements:** Include at least eight equations, with at least two requiring coefficients greater than 2. At least three equations should come from the reaction type cards so the portfolio connects conservation and reaction pattern.",
						"**Completion checks:** Every equation includes before/after atom counts, and at least one mistake is corrected with an explanation."
					].join("\n\n"),
					datasetLink: material("reaction-type-cards"),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Project: Limiting Reactant Story Problem",
					content: [
						"**Project goal:** Create and solve a limiting-reactant problem using a food, craft, or particle analogy, then connect it to a real chemical equation.",
						"**Requirements:** Show the needed ratio, starting amounts, limiting reactant, product amount, and leftovers. Then write the same ratio as a coefficient relationship in a balanced equation. The analogy should make the limiting ingredient obvious before the chemical version is solved.",
						"**Worked example direction:** If one sandwich requires two slices of bread and one slice of cheese, six bread slices and two cheese slices make only two sandwiches because cheese runs out first. The same ratio logic applies when coefficients describe particles reacting in fixed proportions.",
						"**Completion checks:** The analogy and chemical example both use the same ratio logic, and the final explanation identifies leftovers without calling them product."
					].join("\n\n"),
					mediaLink: SIMULATIONS.reactions
				}
			]
		},
		{
			title: "CHM8 Solutions, Concentration, and pH",
			curriculum: [
				{
					title: "Solutes, Solvents, and Solution Vocabulary",
					content: [
						"**Concept path:** A solution is a homogeneous mixture. The solute is dissolved, the solvent does the dissolving, and concentration describes how much solute is present relative to solution amount.",
						"**Remote-safe activity:** Classify solution examples such as salt water, sugar water, air, vinegar, and brass. Identify solute, solvent, and evidence for homogeneous mixture where possible. Use the concentration table when a scenario includes solute amount or solution volume.",
						"**Worked example:** Salt water can be clear and uniform while still being a mixture. Sodium chloride is a compound with a fixed formula; salt water is a solution whose concentration can change.",
						"**Output:** A solution vocabulary chart with examples and non-examples.",
						"**CER checkpoint:** Explain why a clear liquid is not automatically a pure substance."
					].join("\n\n"),
					datasetLink: material(
						"concentration-and-ph-scenario-tables"
					),
					solutionLink: answerKey("concentration-and-ph-key")
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
						"**Concept path:** pH describes how acidic or basic a solution is on a logarithmic scale. Introductory work focuses on interpreting the scale, identifying strong versus weak evidence, and avoiding unsafe tasting or mixing. Acid/base definitions are kept simple here: acids are below 7, bases are above 7, and neutral solutions are near 7 in the common pH model.",
						"**Remote investigation:** Use the PhET pH Scale simulation and the pH scenario table to compare common solutions, dilution, and pH values. Do not require physical pH testing or household chemical mixing.",
						"**Worked example:** Diluting vinegar with water usually moves pH toward 7, but it does not make the acid disappear. The solution becomes less concentrated in acidic particles.",
						"**Output:** A pH comparison table and one dilution prediction.",
						"**CER checkpoint:** Explain why lower pH means more acidic and why dilution usually moves pH toward neutral."
					].join("\n\n"),
					datasetLink: material(
						"concentration-and-ph-scenario-tables"
					),
					mediaLink: SIMULATIONS.phScale
				}
			],
			supplementalProjects: [
				{
					title: "Project: Concentration Investigation",
					content: [
						"**Project goal:** Use a simulation to investigate how concentration changes when solute amount and solution volume change.",
						"**Requirements:** Test at least six scenarios, record variables, and identify one pattern. Include at least one case where solute changes, one where volume changes, one where both change, and one where saturation appears.",
						"**Worked example:** If the solute amount stays the same and water is added, concentration decreases because the same dissolved amount is spread through more solution.",
						"**Completion checks:** The final CER response cites simulation evidence and uses solute, solvent, solution, concentration, dilute, and saturated accurately."
					].join("\n\n"),
					datasetLink: material(
						"concentration-and-ph-scenario-tables"
					),
					mediaLink: SIMULATIONS.concentration
				},
				{
					title: "Project: pH Scale Explanation",
					content: [
						"**Project goal:** Create a short guide to the pH scale using examples from the simulation.",
						"**Requirements:** Include acidic, neutral, and basic examples; one dilution example; one logarithmic-scale caution; and one safety note about not tasting or mixing unknown substances. The guide should explain that a pH change of 1 is not a small linear step, because the pH scale is logarithmic.",
						"**Evidence target:** Use simulation observations or the solution tables to justify each category. For example, identify water as near neutral because of measured pH evidence, not because it is familiar or safe to drink.",
						"**Completion checks:** The explanation separates pH evidence from unsafe or unsupported sensory claims and clearly states how dilution affects concentration."
					].join("\n\n"),
					datasetLink: material(
						"concentration-and-ph-scenario-tables"
					),
					mediaLink: SIMULATIONS.phScale
				}
			]
		},
		{
			title: "CHM9 Moles and Stoichiometry",
			curriculum: [
				{
					title: "Counting Particles with the Mole",
					content: [
						"**Concept path:** A mole is a counting unit for particles, similar in purpose to a dozen but much larger. It connects atomic-scale particles to measurable amounts of matter.",
						"**Remote-safe activity:** Compare counting by ones, dozens, pairs, and moles using simplified analogies. Then translate between number of moles and relative particle counts without requiring memorization-heavy calculation first.",
						"**Worked example:** A dozen means 12 items no matter whether the items are eggs or pencils. A mole means a fixed enormous number of particles, which lets formulas connect particles to lab-scale grams.",
						"**Output:** A mole analogy card and three simple mole-to-particle reasoning examples.",
						"**CER checkpoint:** Explain why chemistry needs a counting unit larger than ordinary numbers."
					].join("\n\n"),
					datasetLink: material(
						"molar-mass-and-stoichiometry-practice-set"
					),
					solutionLink: answerKey("molar-mass-and-stoichiometry-key")
				},
				{
					title: "Molar Mass and Unit Conversion",
					content: [
						"**Concept path:** Molar mass connects grams to moles. Periodic table masses provide the bridge from measurable lab-scale mass to particle-scale amount.",
						"**Remote-safe activity:** Calculate molar masses for H2O, CO2, NaCl, O2, and CaCO3 using a periodic table and the practice set. Keep units visible at every step.",
						"**Worked example:** `H2O` has two hydrogens and one oxygen. With approximate masses H = 1 and O = 16, the molar mass is `2(1) + 16 = 18 g/mol`.",
						"**Output:** Five molar-mass calculations and two grams-to-moles conversions.",
						"**CER checkpoint:** Explain why molar mass depends on formula composition."
					].join("\n\n"),
					datasetLink: material(
						"molar-mass-and-stoichiometry-practice-set"
					),
					solutionLink: answerKey("molar-mass-and-stoichiometry-key")
				},
				{
					title: "Mole Ratios from Balanced Equations",
					content: [
						"**Concept path:** Coefficients in a balanced equation create mole ratios. Stoichiometry uses those ratios to connect reactant amounts to product amounts.",
						"**Remote-safe activity:** Read a balanced equation from the practice set and identify all usable mole ratios. Use simple one-step conversions before combining with grams.",
						"**Worked example:** In `2H2 + O2 -> 2H2O`, the ratio from oxygen to water is `1 mol O2 : 2 mol H2O`. The ratio comes from coefficients, not subscripts.",
						"**Output:** Four mole-ratio problems with the ratio highlighted before calculation.",
						"**CER checkpoint:** Explain why unbalanced equations cannot support stoichiometry."
					].join("\n\n"),
					datasetLink: material(
						"molar-mass-and-stoichiometry-practice-set"
					),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Stoichiometry with Limits and Reasonableness",
					content: [
						"**Concept path:** A stoichiometry answer should be checked for units, balanced-equation ratio, limiting reactant when relevant, and reasonableness. The method matters as much as the number.",
						"**Remote-safe activity:** Solve two guided problems: one moles-to-moles and one grams-to-grams. Mark the equation, known value, conversion factor, target unit, and final reasonableness check. Then compare with one flawed solution from the error-case table.",
						"**Worked example:** A grams-to-grams problem must convert grams to moles, use the balanced-equation mole ratio, then convert moles to grams. Skipping the middle mole step usually means the coefficients are being used incorrectly.",
						"**Output:** Two fully annotated stoichiometry solutions.",
						"**CER checkpoint:** Explain why dimensional analysis is a reasoning tool rather than a formatting trick."
					].join("\n\n"),
					datasetLink: material("stoichiometry-error-cases"),
					solutionLink: answerKey("stoichiometry-error-key")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Molar Mass Reference Sheet",
					content: [
						"**Project goal:** Build a reference sheet that explains molar mass through examples instead of listing formulas alone.",
						"**Requirements:** Include at least eight compounds, show element-by-element contributions, and include one common mistake to avoid. At least two examples should come from the practice set and at least two should be chosen independently from formulas already used in the course.",
						"**Completion checks:** Units are visible in every calculation, and the sheet explains why formulas determine molar mass."
					].join("\n\n"),
					datasetLink: material(
						"molar-mass-and-stoichiometry-practice-set"
					),
					solutionLink: answerKey("molar-mass-and-stoichiometry-key")
				},
				{
					title: "Project: Stoichiometry Error Analysis",
					content: [
						"**Project goal:** Diagnose flawed stoichiometry solutions and repair them.",
						"**Requirements:** Analyze at least four errors: unbalanced equation, wrong mole ratio, missing unit conversion, and unreasonable final unit. For each error, rewrite the incorrect step, explain why it fails, and add one prevention habit. Use the error-case pack so each diagnosis is anchored to an actual flawed setup rather than a generic warning.",
						"**Analysis target:** Name the first invalid step, not only the wrong final answer. A final number can be wrong because the equation was never balanced, because grams were treated as moles, or because the coefficient ratio was inverted.",
						"**Completion checks:** Each repair states the exact error, the corrected step, and how to detect the same mistake next time."
					].join("\n\n"),
					datasetLink: material("stoichiometry-error-cases"),
					solutionLink: answerKey("stoichiometry-error-key")
				}
			]
		},
		{
			title: "CHM10 Advanced Chemistry Map",
			curriculum: [
				{
					title: "Reaction Energy and Rates",
					content: [
						"**Concept path:** Some reactions release energy, some absorb energy, and all reactions require particles to collide in useful orientations. A faster reaction is not automatically a more complete reaction; rate describes how quickly change happens, while energy describes what is transferred or required.",
						"**Remote-safe activity:** Compare two reaction descriptions from the materials pack: one that is warmed, cooled, or catalyzed, and one that releases heat or light. Identify the evidence for energy transfer, the evidence for rate change, and the limits of the description.",
						"**Worked example:** A glow stick emits light and changes brightness over time. The light is evidence of energy transfer, while the fading brightness is evidence about rate and reactant use.",
						"**Output:** A two-column explanation separating energy evidence from rate evidence.",
						"**CER checkpoint:** Explain why a reaction can be energetically favorable but still slow without enough useful collisions."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds")
				},
				{
					title: "Equilibrium as Dynamic Balance",
					content: [
						"**Concept path:** Equilibrium means forward and reverse processes continue at matching rates, not that all motion stops. Introductory equilibrium appears in carbonation, saturated solutions, phase changes in closed systems, and weak acid/base behavior.",
						"**Remote-safe activity:** Use the carbonation or saturation evidence seed to build a before/after/changed-condition explanation. Predict what changes when pressure, temperature, concentration, or volume changes.",
						"**Worked example:** A sealed carbonated drink keeps more dissolved carbon dioxide under pressure. Opening the container changes the system, so gas leaves solution until a new condition is reached.",
						"**Output:** A dynamic-balance diagram with forward process, reverse process, changed condition, and predicted shift.",
						"**CER checkpoint:** Explain why equilibrium is not the same as nothing happening."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds")
				},
				{
					title: "Redox, Batteries, and Electron Transfer",
					content: [
						"**Concept path:** Oxidation-reduction reactions involve electron transfer or changes in electron ownership. A beginner model can connect rusting, batteries, corrosion, and metal-ion changes without requiring a full electrochemistry course.",
						"**Remote-safe activity:** Read a simple battery or rusting evidence seed. Track which particle or substance loses electron density, which gains it, and how the change can move energy through a system.",
						"**Worked example:** In rusting, iron atoms become iron ions in compounds with oxygen. The visible rust is evidence of a new substance, while the electron-transfer model explains why oxidation language is useful.",
						"**Output:** A redox story map with substance before, substance after, electron-transfer idea, and visible evidence.",
						"**CER checkpoint:** Explain why redox is more specific than simply saying a chemical reaction happened."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds")
				},
				{
					title: "Nuclear, Organic, and Materials Chemistry Boundaries",
					content: [
						"**Concept path:** Chemistry branches into specialized areas. Nuclear chemistry changes nuclei, organic chemistry studies carbon-based structures and reactions, and materials chemistry connects structure to properties. This intro course names those areas so later study has a map without pretending each topic is fully covered here.",
						"**Remote-safe activity:** Classify example questions as intro chemistry, nuclear chemistry, organic chemistry, materials chemistry, or interdisciplinary. Decide what evidence would be needed to answer each question responsibly.",
						"**Worked example:** Carbon-14 dating is not ordinary isotope mass practice alone; it depends on nuclear decay. A plastic's flexibility is not just formula reading; it depends on molecular structure and material arrangement.",
						"**Output:** A course-boundary chart naming which topics are core, previewed, or reserved for a future course.",
						"**CER checkpoint:** Explain why naming a boundary is better than giving an oversimplified answer."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines
				}
			],
			supplementalProjects: [
				{
					title: "Project: Advanced Chemistry Concept Card",
					content: [
						"**Project goal:** Create a one-page concept card for one advanced chemistry idea: rate, equilibrium, redox, nuclear chemistry, organic chemistry, or materials chemistry.",
						"**Requirements:** Include a definition, one real-world example, one diagram or model, one piece of evidence, one common misconception, and one sentence explaining whether the topic is core intro material or a preview for later study.",
						"**Completion checks:** The card stays accurate without overclaiming, uses at least three course concepts from earlier modules, and names one question that would require a deeper course."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
				},
				{
					title: "Project: Chemistry Pathway Recommendation",
					content: [
						"**Project goal:** Choose the next chemistry direction after this intro course and justify the recommendation with evidence from course performance and interest.",
						"**Requirements:** Compare at least three paths: quantitative chemistry, organic/biochemistry, environmental chemistry, materials chemistry, or physics-connected chemistry. For each path, list prerequisite skills, useful projects, and one reason it may or may not fit.",
						"**Completion checks:** The recommendation distinguishes what has been mastered from what has only been previewed."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines,
					solutionLink: answerKey("capstone-rubric")
				}
			]
		},
		{
			title: "CHM11 Capstone: Real-World Chemistry Explanation",
			curriculum: [
				{
					title: "Choosing a Chemistry Phenomenon",
					content: [
						"**Concept path:** A capstone phenomenon should be narrow enough to explain with course concepts and evidence. Good choices include corrosion, carbonation, water hardness, dissolving, air quality chemistry, battery basics, cooking chemistry, cleaning chemistry, or material properties.",
						"**Remote-safe activity:** Compare three possible capstone topics using the evidence seeds. Score each for safety, available evidence, chemistry vocabulary, and scope.",
						"**Worked example:** Carbonation is a strong capstone topic because it can connect gas solubility, pressure, pH, equilibrium preview, and evidence from diagrams or simulation-style models without requiring any physical tasting or mixing.",
						"**Output:** A topic-selection table and a one-sentence research question.",
						"**CER checkpoint:** Explain why the selected topic can be studied without a required physical experiment."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
				},
				{
					title: "Building the Evidence Set",
					content: [
						"**Concept path:** A strong chemistry explanation uses multiple evidence types: observation, diagram, data table, simulation, equation, or authoritative reference. The evidence must be relevant to the claim.",
						"**Remote-safe activity:** Gather or use evidence from the materials pack for the capstone topic. At least one source should be a diagram, simulation, or data table; at least one should be a written reference.",
						"**Worked example:** A rusting explanation can use a before/after image, a particle model, and a redox preview. A weak evidence source would be a photo with no context or no connection to the claim.",
						"**Output:** An evidence log with source, what it shows, how it supports the claim, and one limitation.",
						"**CER checkpoint:** Reject one piece of weak evidence and explain why it does not support the claim."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
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
						"**Requirements:** Include a claim, evidence log, particle/model explanation, at least four course vocabulary terms, one diagram or simulation reference, one changed-condition prediction, and one limitation. The final artifact should name which parts of the topic were covered in the intro course and which parts are advanced previews.",
						"**Completion checks:** The final artifact is self-contained, source-backed, remote-safe, and specific enough to be corrected or challenged."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
				},
				{
					title: "Project: Capstone Peer Review",
					content: [
						"**Project goal:** Review a capstone explanation using a rubric for claim clarity, evidence quality, chemistry accuracy, model use, safety, and next-step reasoning.",
						"**Requirements:** Provide at least two strengths, two revision targets, and one question that would improve the investigation. Each comment should point to a specific claim, data point, model, or vocabulary choice.",
						"**Completion checks:** Feedback references the artifact directly and avoids vague comments such as good job or add more detail without naming what detail is missing."
					].join("\n\n"),
					datasetLink: REFERENCES.ngssAppendices,
					solutionLink: answerKey("capstone-rubric")
				}
			]
		},
		{
			title: "CHM12 Chemistry Resource Bank",
			curriculum: [
				{
					title: "Core Chemistry References",
					content: [
						"**Resource bank:** Use the ACS Chemistry Guidelines, ACS periodic table, NIST SI units page, NGSS appendices, and the local materials pack as reference material for standards, safety boundaries, periodic-table reading, units, and evidence practices.",
						"**Use:** These links are not separate assignments by default. They support the specific lessons and projects that cite them.",
						"**Completion check:** Any reference used in a project should be named in the evidence log with a short note explaining what it contributed."
					].join("\n\n"),
					datasetLink: MATERIALS.pack,
					solutionLink: MATERIALS.answerKey
				},
				{
					title: "Simulation Set",
					content: [
						"**Resource bank:** The course uses PhET simulations for atoms, states of matter, molecule shapes, balancing equations, limiting reactants, concentration, molarity, and pH. These simulations provide controlled evidence sources when a physical lab would require materials, supervision, or safety equipment outside the scope of a remote course.",
						"**Use:** A simulation counts as evidence only when a specific setting, observation, or screenshot is connected to a claim. A good simulation note records the variable changed, the visible result, and the particle-level interpretation.",
						"**Completion check:** Simulation-based work should include the variable changed, what was observed, what the observation supports, and one limitation of the model."
					].join("\n\n"),
					mediaLink:
						"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry"
				},
				{
					title: "Remote-Safe Investigation Checklist",
					content: [
						"**Resource bank:** Required work can be completed with a browser, notes, diagrams, screenshots, tables, and writing. Optional household observations are replaceable with provided evidence or simulations.",
						"**Use:** Before a project begins, identify the phenomenon, evidence source, vocabulary target, model, and final CER prompt. If the evidence source is a simulation or table, record why that source is appropriate for the claim being made.",
						"**Safety boundary:** Tasks may use public datasets, diagrams, readings, simulations, or simple observations that do not require handling chemicals. Anything involving beakers, kits, unknown chemicals, heat, pressure buildup, electrical components, ingestion, outdoor collection, or adult-managed supplies is replaced with a nonphysical evidence source.",
						"**Completion check:** The task names the evidence source clearly and can be finished without acquiring or mixing materials."
					].join("\n\n")
				},
				{
					title: "Chemistry Explanation Rubric",
					content: [
						"**Resource bank:** Strong explanations are assessed by claim clarity, evidence relevance, particle-model reasoning, accurate vocabulary, safe scope, and changed-condition prediction. The rubric categories are summarized here so checks stay consistent across projects.",
						"**Use:** Apply the rubric to project drafts before final submission. A weak explanation usually needs a narrower claim, better evidence, or a clearer model.",
						"**Completion check:** The final work can answer: What is the claim? What evidence supports it? What particle-level model explains it? What would change under a new condition?"
					].join("\n\n"),
					solutionLink: MATERIALS.answerKey
				}
			],
			supplementalProjects: [
				{
					title: "Project: Simulation Evidence Log",
					content: [
						"**Project goal:** Build a reusable evidence log for one PhET chemistry simulation.",
						"**Requirements:** Include simulation name, variables changed, screenshots or sketches, observations, claim, evidence, reasoning, and limitation. Use the materials pack headings as a template for naming variables and changed conditions.",
						"**Analysis target:** Each row should separate what changed from what was measured or observed. For example, changing solute amount is a variable change; color intensity or concentration reading is evidence; the conclusion belongs in the reasoning column.",
						"**Completion checks:** The log identifies exactly what the simulation shows and does not treat the simulation as proof without explanation."
					].join("\n\n"),
					datasetLink: MATERIALS.pack,
					mediaLink:
						"https://phet.colorado.edu/en/simulations/filter?subjects=chemistry"
				},
				{
					title: "Project: Chemistry Reference Card",
					content: [
						"**Project goal:** Create a concise reference card for one recurring chemistry tool: periodic table, units, CER, particle diagrams, balancing equations, or pH scale.",
						"**Requirements:** Include the tool's purpose, how to read it, one example, one common mistake, and one link to a supporting reference. If the card covers a calculation tool, include units and one completed sample calculation.",
						"**Completion checks:** The card is useful during a later project without needing a separate explanation."
					].join("\n\n"),
					datasetLink: MATERIALS.pack,
					solutionLink: MATERIALS.answerKey
				}
			]
		}
	]
};
