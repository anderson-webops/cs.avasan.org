import type { RawCourse } from "./types";

const SIMULATIONS = {
	balancingEquations:
		"https://phet.colorado.edu/en/simulations/balancing-chemical-equations",
	buildAtom: "https://phet.colorado.edu/en/simulations/build-an-atom",
	concentration: "https://phet.colorado.edu/en/simulations/concentration",
	gasProperties: "https://phet.colorado.edu/en/simulations/gas-properties",
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
	nistSiUnits: "https://www.nist.gov/pml/owm/metric-si/si-units",
	openStaxChemistry: "https://openstax.org/details/books/chemistry-2e"
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
						"**Concept path:** Chemistry studies matter, the particles that make it up, and the evidence that shows when matter changes. A chemistry explanation usually connects three levels at once: what is visible at the human scale, what is modeled at the particle scale, and what measurements or references support the claim. This course uses notebooks, shared simulations, diagrams, short readings, and provided data tables rather than required household chemicals or physical lab supplies, so the focus stays on reasoning from safe evidence. A strong explanation should separate observation from inference: seeing ice melt is an observation, while explaining faster particle motion and changing arrangement is a model-based inference.",
						"**Use this section:** Start by choosing one visible phenomenon, then describe it twice: once as plain observation and once as a particle-level explanation. Keep a notebook page open while reading so each new idea can be sorted into observation, model, evidence, or claim. A useful routine is: name what changed, identify what evidence is available, choose a particle model, and write one sentence explaining how the model accounts for the evidence.",
						"**Remote-safe activity:** Set up a chemistry notebook with four recurring sections: observation, particle model, evidence, and claim-evidence-reasoning. Use a simple example such as ice melting, salt dissolving, or a metal object rusting to separate what can be observed from what must be inferred.",
						"**Output:** A one-page notebook template and a short explanation of why particle models can explain more than visible description alone.",
						"**CER checkpoint:** Make one claim about a visible change, cite one observable piece of evidence, and connect the evidence to a particle-level explanation."
					].join("\n\n"),
					datasetLink: REFERENCES.acsChemistryGuidelines
				},
				{
					title: "Measurement, Units, Significant Figures, and Data Quality",
					content: [
						"**Concept path:** Chemistry measurements are only meaningful when the number, unit, scale, and uncertainty are all known. Mass, volume, temperature, time, and concentration become evidence only when the measuring method and precision are clear; `25.0 mL` communicates different precision than `25 mL`. Scientific notation keeps very large particle counts and very small atomic-scale quantities readable, while significant figures show how much precision the original measurement supports. Good data habits prevent false certainty: converting units correctly matters, but reporting more digits than the measurement supports can make an answer look more accurate than it is.",
						"**Use this section:** Read every number as a measurement package, not just a value. For each example, ask: What quantity is being measured? What unit is attached? How precise is the measurement? Does the answer need a unit conversion? Is the final number more precise than the original data supports? Work slowly enough that units cancel visibly and uncertainty is mentioned before drawing a conclusion.",
						"**Remote-safe activity:** Compare the measurement tables in the materials pack. Identify which table is easiest to interpret, which table can be repaired by unit conversion, and which table lacks enough context to support a chemistry conclusion. Then classify sample numbers as exact counts, measured values, or converted values so precision is not treated as decoration.",
						"**Worked example:** A mass of `0.0248 kg` and a volume of `25.0 mL` cannot be compared directly to grams and milliliters until the mass is converted to `24.8 g`. The number is not the only data; the unit is part of the measurement.",
						"**Data quality check:** Use one row to calculate percent error or percent difference from an expected value. If a value is written as `2.50 g`, the trailing zero matters because it shows the measurement was made to the hundredths place; rewriting it as `2.5 g` silently removes precision.",
						"**Output:** A corrected table with units, one converted value, one scientific-notation rewrite, one significant-figure note, and one short comment about uncertainty or missing context.",
						"**CER checkpoint:** Explain how an unlabeled number or over-precise answer can produce a wrong chemistry conclusion even when the arithmetic is correct."
					].join("\n\n"),
					datasetLink: material(
						"measurement-tables-and-unit-conversions"
					),
					solutionLink: answerKey("measurement-tables-key")
				},
				{
					title: "Models, Diagrams, and Limits",
					content: [
						"**Concept path:** A model is a useful simplification that highlights some features of a system while hiding others. Chemistry depends on models because atoms, ions, molecules, and energy changes are not directly visible in ordinary observation. Particle diagrams can show spacing and arrangement, formulas can show composition, simulations can show controlled changes, graphs can show patterns over time, and equations can show conservation and ratios. The important habit is to ask what question the model answers and what it leaves out; no model should be treated as a perfect copy of matter itself.",
						"**Use this section:** Compare representations by function. Build a short list for each model: what it shows well, what it hides, and what question it can answer. When choosing between a formula, diagram, graph, simulation, or equation, state the question first; the best model is the one that gives the needed evidence for that question without pretending to show everything.",
						"**Remote-safe activity:** Compare a particle diagram, a chemical formula, and a simulation screenshot for the same substance or process. Identify one strength and one limitation of each representation.",
						"**Decision rule:** Pick the model that answers the current question. A formula is efficient for composition, a particle diagram is better for spacing and arrangement, a graph is better for change over time, and an equation is better for conservation and ratios. No single representation should be treated as the whole explanation.",
						"**Output:** A model-comparison table with the columns representation, what it shows well, what it hides, when it is useful, and one question it cannot answer alone.",
						"**CER checkpoint:** Defend which model is best for explaining a beginner question about matter, and identify one question that the model cannot answer by itself."
					].join("\n\n"),
					datasetLink: material("model-comparison-cards"),
					solutionLink: answerKey("model-comparison-key")
				},
				{
					title: "Safety and Remote Investigation Boundaries",
					content: [
						"**Concept path:** Safe chemistry learning separates evidence-based investigation from unnecessary physical risk. Required work in this course uses simulations, diagrams, provided data, public references, and writing so every task can be completed remotely without buying, mixing, heating, tasting, or disposing of materials. Optional household observations are only acceptable when they are simple, safe, and fully replaceable with a non-physical evidence source. A chemistry claim does not require a home experiment to be valid; it requires relevant evidence, clear reasoning, and honest limits on what the evidence can show.",
						"**Use this section:** Treat safety as part of the investigation design. Before starting a task, identify the evidence source, decide whether the evidence can be gathered from a simulation or provided table, and replace any activity involving unknown substances, heat, pressure, ingestion, or disposal with nonphysical evidence. The final explanation should still name what evidence was used and why that evidence is appropriate.",
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
						"**Requirements:** Name the chemistry idea, explain what each representation shows, identify what each leaves out, and choose which one is most useful for a beginner explanation. Include at least one case where the less-useful model is still valuable for a narrower question.",
						"**Analysis target:** The final answer should not rank models by appearance. It should explain the information each model preserves. For example, a balanced equation is powerful for atom conservation but weak for molecular shape or reaction speed unless additional evidence is added.",
						"**Completion checks:** The comparison uses at least three chemistry vocabulary terms, includes one limitation instead of claiming any model is perfect, and ends with one revised explanation that combines the two models."
					].join("\n\n"),
					datasetLink: material("model-comparison-cards"),
					solutionLink: answerKey("model-comparison-key")
				}
			]
		},
		{
			title: "CHM2 Matter, Classification, and Particle Models",
			curriculum: [
				{
					title: "Matter, Properties, and Classification",
					content: [
						"**Concept path:** Matter is anything that has mass and occupies space, but chemistry usually goes further by describing what kind of matter it is and what properties provide evidence. Physical properties such as density, melting point, boiling point, color, conductivity, solubility, and state at room temperature can be observed or measured without changing substance identity. These properties help distinguish samples, but they must be used carefully: appearance alone is weak evidence, while a repeated measured property such as density or boiling point is stronger. Classification should be based on the material and its composition, not merely on the object shape or everyday name.",
						"**Use this section:** Sort examples by evidence rather than familiarity. First decide whether the example is matter, then identify whether the description names an object, a material, or a property. Useful evidence includes mass, volume, composition, and measurable properties; weak evidence includes appearance alone or assumptions from everyday use. End by writing one sentence that explains the classification using mass/space or property reasoning.",
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
						"**Concept path:** Matter can be classified by composition. A pure substance has a fixed composition and a consistent chemical identity; an element contains one kind of atom, while a compound contains atoms of different elements chemically bonded in fixed ratios. A mixture combines substances physically, so its composition can vary even when it looks uniform. Homogeneous mixtures are uniform throughout, while heterogeneous mixtures contain visibly or structurally different parts. The key distinction is not whether a sample looks simple, but whether its particles have a fixed chemical formula or a variable composition.",
						"**Use this section:** Use a decision tree instead of guessing from appearance. Ask whether the composition is fixed; if it is fixed, decide whether the particles contain one element or bonded elements in a fixed ratio. If the composition can vary, classify the sample as a mixture and then decide whether it is uniform throughout. For uncertain examples, write the missing evidence rather than forcing a category.",
						"**Remote-safe activity:** Classify examples such as oxygen gas, water, salt water, brass, air, carbon dioxide, and trail mix. The key is whether the composition is fixed and whether atoms are bonded into a new substance.",
						"**Decision rule:** Ask first whether the sample has enough information to classify. If composition can vary, it is a mixture even when it looks uniform. If the formula is fixed and the atoms are bonded, it is a compound. If only one element symbol is present, it is an element, even when the particles are paired as a molecule such as `O₂`.",
						"**Output:** A decision tree for element, compound, homogeneous mixture, and heterogeneous mixture, plus one uncertain card that names the missing evidence.",
						"**CER checkpoint:** Explain why salt water is not the same category as sodium chloride even though both contain sodium and chlorine."
					].join("\n\n"),
					datasetLink: material("matter-and-classification-cards"),
					solutionLink: answerKey("matter-and-classification-key")
				},
				{
					title: "Particle Models of Solids, Liquids, and Gases",
					content: [
						"**Concept path:** Solids, liquids, and gases are states of matter described by particle arrangement, spacing, attraction, and motion. In a solid, particles stay in an organized or fixed arrangement while vibrating; in a liquid, particles remain close but can slide past one another; in a gas, particles are much farther apart and move freely through available space. A state label describes behavior under current conditions, not permanent identity: water can be solid ice, liquid water, or water vapor while still made of the same molecules. This distinction keeps phase changes separate from chemical reactions.",
						"**Use this section:** Describe each state with four repeated categories: arrangement, spacing, motion, and attraction. Avoid saying particles are hard, wet, or airy; those are macroscopic descriptions. Instead, translate visible properties into particle behavior, such as fixed shape becoming limited particle movement or gas expansion becoming wide spacing and free motion.",
						"**Remote investigation:** Use the PhET States of Matter simulation to compare particle motion in a solid, liquid, and gas. Focus on spacing, vibration, freedom of movement, and how energy changes the model.",
						"**Reasoning focus:** Keep particle identity separate from particle arrangement. Water vapor, liquid water, and ice can all be modeled as the same particles under different conditions. A state change can alter spacing and motion without changing which atoms are present.",
						"**Output:** Three particle diagrams with one sentence explaining each state, one changed-condition arrow showing heating or cooling, and one note about what the simulation simplifies.",
						"**CER checkpoint:** Use simulation evidence to explain why gases expand to fill available space while solids keep shape."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				},
				{
					title: "Physical Change and Conservation of Substance",
					content: [
						"**Concept path:** A physical change alters form, size, state, arrangement, or distribution without creating a new substance. Melting, freezing, condensing, cutting, crushing, and many kinds of dissolving or mixing can be physical changes because the same particles are still present afterward. The visible change may be dramatic, but dramatic appearance is not enough evidence for a chemical reaction. To claim a chemical change, there must be evidence that atoms have been rearranged into new substances; otherwise, the safer explanation is a physical change with changed arrangement or phase.",
						"**Use this section:** Evaluate changes by asking what evidence shows a new substance. Make a two-column note: visible change on the left and particle-level interpretation on the right. If the only evidence is changed shape, size, state, or distribution, classify the change as physical or uncertain. Only call it chemical when the evidence points to new substances with new particle arrangements.",
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
						"**Analysis target:** Include one card where visible appearance is misleading and one card where composition evidence is decisive. The strongest work shows why a property such as color or clarity is not enough by itself unless it is connected to composition, fixed ratio, or separable parts.",
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
						"**Concept path:** Atomic structure connects particle counts to identity, mass, charge, and chemical behavior. Protons are positively charged particles in the nucleus and define the element; the atomic number is the number of protons, not the total number of subatomic particles. Neutrons are neutral particles in the nucleus that affect isotope identity and mass number. Electrons are negatively charged particles outside the nucleus that affect charge, bonding, and reactivity. Keeping these roles separate prevents common errors such as treating an ion as a new element or treating neutron changes as charge changes.",
						"**Use this section:** Track one particle type at a time. Build a table with columns for protons, neutrons, electrons, element identity, mass number, and charge. Change only one particle count per row and record what changed. This makes the rules visible: proton changes alter element identity, neutron changes alter isotope/mass number, and electron changes alter charge.",
						"**Remote investigation:** Use the PhET Build an Atom simulation to change protons, neutrons, and electrons separately. Track which changes alter element identity, isotope, mass number, and charge.",
						"**Reasoning focus:** Atomic identity is controlled by the nucleus because the proton count defines the element. Neutrons change isotope and mass number; electrons change charge and many chemical interactions. This separation prevents the common mistake of calling every charged atom a new element.",
						"**Output:** A particle-change table with rows for adding a proton, adding a neutron, adding an electron, and removing an electron. Each row should name what changes and what stays the same.",
						"**CER checkpoint:** Explain why changing proton count is more identity-changing than changing electron count."
					].join("\n\n"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Isotopes and Average Atomic Mass",
					content: [
						"**Concept path:** Isotopes are atoms of the same element with the same number of protons but different numbers of neutrons. Because proton count stays the same, isotopes remain the same element; because neutron count changes, their mass numbers differ. The atomic mass on a periodic table is an abundance-weighted average of naturally occurring isotopes, which is why it is often not a whole number. A single atom has a mass number such as 12 or 14, while a periodic-table atomic mass such as 12.011 represents an average across many atoms.",
						"**Use this section:** Keep three numbers separate: atomic number, mass number, and average atomic mass. Atomic number identifies the element, mass number identifies a specific isotope, and average atomic mass summarizes a sample of naturally occurring isotopes. When comparing isotopes, write what stayed the same and what changed before doing any calculation.",
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
						"**Concept path:** An ion is an atom or bonded group of atoms with a net electrical charge because the number of protons and electrons is unequal. Losing electrons makes a positive ion, or cation, because there are more protons than electrons; gaining electrons makes a negative ion, or anion, because there are more electrons than protons. Ordinary ion formation changes electron count, not proton count, so the element identity remains the same. This is why a sodium atom and a sodium ion are both sodium, even though their charge and chemical behavior differ.",
						"**Use this section:** Calculate charge with the rule `protons - electrons`. If the result is positive, the particle is a cation; if negative, it is an anion; if zero, it is neutral. Always identify the element from proton count before calculating charge. This order prevents the mistake of treating electron loss or gain as a change in element identity.",
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
						"**Concept path:** Atomic notation is a compact way to communicate element identity, isotope, and charge. The element symbol identifies the element, the atomic number gives proton count, the mass number gives protons plus neutrons, and the charge tells how electron count differs from proton count. Reading notation correctly means calculating each role instead of guessing from the symbol alone: neutrons come from mass number minus atomic number, while electrons depend on charge. This notation keeps isotope identity and ion charge in the same view without confusing them.",
						"**Use this section:** Decode notation in a fixed order: identify the element symbol, read or infer atomic number, calculate neutrons from mass number minus protons, then calculate electrons from charge. Write each step even when the answer seems obvious. The goal is to make isotope and ion reasoning automatic without mixing up mass number, atomic mass, and charge.",
						"**Remote-safe activity:** Translate between notation, particle counts, and plain-language descriptions. Include neutral atoms, positive ions, negative ions, and isotopes from the materials pack.",
						"**Worked example:** Carbon-14 has 6 protons and 8 neutrons. If it is neutral, it has 6 electrons; if the charge changes, the electron count changes but the proton count still identifies carbon.",
						"**Notation habit:** Read the symbol after identifying the atomic number, then calculate neutrons from mass number minus protons, and calculate electrons from charge. Do not treat the mass number as charge or the atomic mass average as the neutron count.",
						"**Output:** A notation translation table with at least six examples, including one isotope, one cation, one anion, and one neutral atom.",
						"**CER checkpoint:** Explain which number identifies the element and which number identifies the isotope."
					].join("\n\n"),
					datasetLink: material("isotope-table"),
					mediaLink: SIMULATIONS.buildAtom
				},
				{
					title: "Checkpoint: Atomic Structure, Isotopes, and Ions",
					content: [
						"**Checkpoint goal:** Verify that particle counts, isotope notation, and ion charge can be interpreted without mixing up the roles of protons, neutrons, and electrons.",
						"**Tasks:** Solve one neutral-atom problem, one isotope problem, one positive-ion problem, one negative-ion problem, and one average-atomic-mass interpretation question. Each answer should show the arithmetic or rule used, not just the final label.",
						"**Mastery evidence:** A complete response explains why proton count controls element identity, why neutron count controls isotope, why electron count controls charge, and why periodic-table atomic mass is an abundance-weighted average rather than the mass of every atom.",
						"**Revision trigger:** If any answer changes the element after only changing electrons, or treats different isotopes as different elements, return to the particle-change table before continuing."
					].join("\n\n"),
					datasetLink: material("atomic-structure-checkpoint"),
					solutionLink: answerKey("atomic-structure-checkpoint-key")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Atom Builder Challenge",
					content: [
						"**Project goal:** Create a challenge set for atomic structure using particle counts. Each challenge should specify a target identity, isotope, or charge and require a built atom or ion.",
						"**Requirements:** Include at least eight challenges: two neutral atoms, two isotopes, two positive ions, and two negative ions. Each challenge should include both a Build an Atom screenshot/sketch and the arithmetic used to determine identity, mass number, or charge.",
						"**Analysis target:** Add one intentionally tricky challenge where the element identity stays the same even though charge changes, and one where mass number changes even though the element stays the same. These two cases force the distinction between isotope and ion.",
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
						"**Evidence target:** Use the isotope table to support the correction. A strong answer names the exact particle count that stayed the same and the exact particle count that changed, then explains what that means for the claim.",
						"**Completion checks:** At least one correction addresses the misconception that different isotopes are different elements, and at least one correction addresses the difference between mass number and average atomic mass."
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
						"**Concept path:** The periodic table is a structured evidence tool that organizes elements by increasing atomic number and recurring chemical properties. An element box usually contains a symbol, name, atomic number, and average atomic mass, but the position of the box also matters. Elements in similar regions often show related behavior because their electron arrangements, especially valence electrons, follow patterns. Reading the table means combining box data with location: atomic number gives proton count, atomic mass supports isotope and molar-mass reasoning, and table position gives a first prediction about bonding and reactivity.",
						"**Use this section:** Practice reading the table in layers. First read the element box, then locate the element's group and period, then identify its broad region, and finally make one cautious prediction from position. Keep the prediction tied to evidence; table position gives a starting expectation, not a complete description of every property.",
						"**Remote-safe activity:** Use the ACS periodic table to read element boxes for hydrogen, carbon, oxygen, sodium, chlorine, iron, and neon. Record symbol, atomic number, approximate atomic mass, and one property or use.",
						"**Reading habit:** Treat every element box as a compact data source. Atomic number gives proton count; symbol identifies the element; atomic mass connects to isotopes and molar mass later; table position gives a first prediction about valence and reactivity.",
						"**Output:** A seven-element table and one sentence explaining the difference between atomic number and atomic mass. Include one example where table position predicts a property before a detailed reading supplies the evidence.",
						"**CER checkpoint:** Explain why the periodic table is an evidence tool, not only a memorization chart."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Groups, Periods, Metals, Nonmetals, and Metalloids",
					content: [
						"**Concept path:** Columns on the periodic table are groups, rows are periods, and broad regions provide useful first predictions about properties. Metals are often conductive, malleable, and likely to form positive ions; nonmetals often form covalent bonds or negative ions; metalloids show mixed behavior depending on the situation. Special groups such as alkali metals, alkaline earth metals, halogens, and noble gases are useful because they summarize recurring patterns. These categories are not a substitute for evidence, but they help organize expectations before a specific property is measured or researched.",
						"**Use this section:** Build a labeled map of the table rather than memorizing isolated locations. For each region or group, write one property pattern, one example element, and one caution about overgeneralizing. Then use the map to explain an unfamiliar element by position before checking a reference.",
						"**Remote-safe activity:** Color-code a blank periodic table by major regions and write one evidence-based property statement for each region.",
						"**Reasoning focus:** Categories are useful because they summarize repeated evidence, not because the boundaries are magic. A metalloid can share some metal-like and nonmetal-like behavior, and a group trend can be stronger evidence than a single memorized fact.",
						"**Output:** A region map and a vocabulary glossary for group, period, metal, nonmetal, metalloid, halogen, and noble gas. Add one caution explaining why region labels are predictions rather than complete descriptions.",
						"**CER checkpoint:** Use table position to predict whether an unfamiliar element is more likely to behave like a metal or nonmetal."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Valence Electrons and Reactivity Patterns",
					content: [
						"**Concept path:** Valence electrons are the outer-shell electrons most involved in bonding, ion formation, and reactivity. Main-group elements in the same group often have similar valence patterns, which helps explain why lithium, sodium, and potassium behave similarly or why fluorine and chlorine share halogen behavior. The introductory model is not a full quantum explanation, but it gives a powerful rule of thumb: similar outer-electron arrangements often lead to similar chemical behavior. Valence reasoning also connects periodic-table position to later topics such as ionic charge, covalent bonding, molecule shape, and reaction patterns.",
						"**Use this section:** Compare elements by group before comparing them by name or everyday familiarity. Pick two elements in the same group and explain what valence pattern they likely share. Then pick two elements in different groups and explain how different valence behavior could lead to different ion formation, bonding, or reactivity.",
						"**Remote-safe activity:** Compare lithium, sodium, and potassium; fluorine, chlorine, and bromine; and helium, neon, and argon. Record what their group position suggests about reactivity.",
						"**Causal model:** Similar valence patterns help explain why group members often react similarly. Alkali metals tend to lose one valence electron, halogens tend to gain or share one electron, and noble gases already have stable outer-shell arrangements in the introductory model.",
						"**Output:** A group-pattern table that links position, valence idea, and predicted behavior. Include one comparison that explains similar behavior and one comparison that explains why elements in different groups behave differently.",
						"**CER checkpoint:** Explain why noble gases are often less reactive than nearby elements."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Trend Reasoning Without Memorizing Every Detail",
					content: [
						"**Concept path:** Periodic trends describe how properties tend to change across periods and down groups. Atomic radius, ionization energy, electronegativity, and metallic character are not random facts; they are connected to nuclear attraction, electron shielding, and energy levels. Across a period, atoms often become smaller and attract electrons more strongly because additional protons pull on electrons in the same general shell. Down a group, atoms often become larger because added energy levels place valence electrons farther from the nucleus. Introductory trend work should emphasize explanation and evidence over memorizing every exception.",
						"**Use this section:** For each trend comparison, write the direction first, then the reason. Useful prompts are: Are the elements in the same period or group? Is the main issue nuclear attraction, shielding, or energy level? Does the provided trend table support the prediction? If an exception or missing data appears, state the uncertainty instead of forcing the simplified trend.",
						"**Remote-safe activity:** Use the periodic trend mini table to compare two elements. Decide which has a larger atomic radius or stronger attraction for electrons and explain the evidence source.",
						"**Worked example:** Sodium is below lithium in group 1, so the simplified trend table supports predicting a larger atomic radius for sodium. Fluorine is far to the right in period 2, so it is modeled as strongly attracting electrons.",
						"**Causal model:** Across a period, added protons increase nuclear attraction while electrons are added to the same general energy level, so atomic radius often decreases and electron attraction often increases. Down a group, extra energy levels place valence electrons farther from the nucleus and shielding increases, so radius often increases.",
						"**Output:** Three trend comparison answers with a one-sentence justification each. Each justification should name the direction on the table and the simplified attraction or shielding idea behind the trend.",
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
						"**Analysis target:** Include one prediction based on group, one prediction based on period or trend direction, and one limitation that names missing evidence. The cards should not imply that table position alone proves every property.",
						"**Completion checks:** The final comparison explains one similarity within a group and one difference across a period."
					].join("\n\n"),
					datasetLink: REFERENCES.acsPeriodicTable
				},
				{
					title: "Project: Periodic Trend Argument",
					content: [
						"**Project goal:** Choose three element pairs and make a short argument about a periodic trend for each pair.",
						"**Requirements:** Each argument must identify the trend, cite table position or provided trend data, and explain the reasoning in plain language. Include one pair across a period, one pair down a group, and one pair where the prediction should be stated cautiously.",
						"**Evidence target:** For each pair, identify whether attraction, shielding, or energy level changes are the main simplified explanation. If the trend table does not provide enough evidence for a confident claim, say what additional data would be needed.",
						"**Completion checks:** The work avoids unsupported claims such as nearby elements are always identical and distinguishes trend evidence from exact numerical property data."
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
						"**Concept path:** Chemical bonding explains why atoms or ions stay associated in stable substances. At an introductory level, bonding is modeled through attractions involving charged particles and valence electrons: positive and negative ions attract in ionic compounds, while nonmetal atoms share electron pairs in covalent molecules. Bonding is not simply atoms wanting to be full; it is a lower-energy or more stable arrangement of particles compared with the separated pieces. This section links periodic-table patterns to formulas, names, structures, and properties.",
						"**Use this section:** Identify the particle model before writing formulas or names. Decide whether the example is best modeled as ionic attraction among ions or covalent sharing within molecules, then connect that model to a formula and one property prediction. Avoid treating bonding categories as labels only; each category should explain what particles are attracting and why the arrangement is stable.",
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
						"**Concept path:** Ionic compounds are built from positive and negative ions arranged so total charge balances to zero. The formula for an ionic compound does not usually describe a single molecule; it gives the simplest whole-number ratio of ions in the repeating structure, called a formula unit. Formula writing therefore begins with ion charges and ends with the smallest neutral ratio. Subscripts are not chosen by sound or memorization alone: they are evidence of charge balance. Polyatomic ions must be kept together as charged groups when more than one copy is needed.",
						"**Use this section:** Follow a charge-balance routine: write the cation and anion, write each charge, choose the smallest ratio that makes total charge zero, then check that the final formula is neutral. If a polyatomic ion appears more than once, use parentheses to show the group stays together. Read each subscript as part of the ratio, not as a prefix from the name.",
						"**Remote-safe activity:** Use the ion cards to build neutral formulas such as `NaCl`, `MgCl₂`, `Al₂O₃`, `CaF₂`, and `NH₄NO₃`. Balance total positive and negative charge before writing the formula.",
						"**Worked example:** Aluminum is `+3` and oxide is `-2`, so the smallest neutral ratio is two aluminum ions and three oxide ions: `Al₂O₃`.",
						"**Naming connection:** Formula writing and naming should agree. `MgCl₂` is magnesium chloride because magnesium keeps its element name and chlorine becomes chloride. Polyatomic ions such as ammonium and nitrate stay grouped when they appear in a formula.",
						"**Output:** Six ionic formula examples with charge-balance evidence and matching compound names.",
						"**CER checkpoint:** Explain why `MgCl₂` needs two chloride ions for one magnesium ion."
					].join("\n\n"),
					datasetLink: material("ion-and-formula-cards"),
					solutionLink: answerKey("ion-formula-key")
				},
				{
					title: "Covalent Molecules and Lewis-Style Thinking",
					content: [
						"**Concept path:** Covalent molecules form when atoms, usually nonmetals, share electron pairs. A Lewis-style model tracks valence electrons so the bonding pattern can be explained rather than memorized. Lines or shared pairs represent covalent bonds, while lone pairs represent valence electrons that are not shared in a bond. These diagrams are simplified: they do not show exact electron motion or full 3D shape by themselves, but they help connect formula, bonding, electron regions, and later molecular geometry.",
						"**Use this section:** Draw covalent structures as a reasoning process. Count valence electrons, sketch a plausible atom arrangement, add shared pairs as bonds, place remaining electrons as lone pairs, and check whether the drawing is reasonable for the introductory model. After the drawing, state one thing the model shows and one thing it does not show, such as exact bond angles or electron motion.",
						"**Remote-safe activity:** Sketch simple dot or line structures for `H₂`, `O₂`, `H₂O`, `CO₂`, `CH₄`, and `NH₃`. Count bonds and lone pairs where appropriate.",
						"**Reasoning focus:** A reliable sequence is valence electrons, central atom when needed, bonds, then remaining electrons. The diagram is a model for electron sharing and shape clues, not a photograph of the molecule.",
						"**Output:** A molecule sketch set with formula, atom count, bonds, lone pairs when relevant, and one limitation of the drawing.",
						"**CER checkpoint:** Explain why water and carbon dioxide have different shapes even though both contain three atoms."
					].join("\n\n"),
					datasetLink: material("lewis-structure-practice-set"),
					solutionLink: answerKey("lewis-structure-key")
				},
				{
					title: "Naming Compounds from Formula Patterns",
					content: [
						"**Concept path:** Chemical naming is a communication system for composition and bonding model. Ionic names usually identify the positive ion first and the negative ion second, with charge balance handled by the formula rather than by prefixes. Covalent names often use prefixes such as mono-, di-, and tri- to show atom counts because the substances are molecular rather than ion ratios. Polyatomic ions add another layer because a charged group such as nitrate or ammonium keeps its name and identity inside a larger formula. Naming becomes easier when it is tied to bonding type and formula evidence instead of memorized as isolated word pairs.",
						"**Use this section:** Decide the naming system before naming the compound. Ask whether the formula is ionic, covalent, or includes a polyatomic ion; then apply the matching rules. For each practice item, write both the formula evidence and the naming rule used. This prevents mixing systems, such as using covalent prefixes for a simple ionic compound.",
						"**Remote-safe activity:** Use the nomenclature practice cards to name compounds and write formulas from names. Include simple ionic examples such as sodium chloride, polyatomic-ion examples such as ammonium nitrate, and covalent examples such as carbon dioxide.",
						"**Worked example:** `CO₂` is carbon dioxide because both elements are nonmetals and the prefix `di-` marks two oxygen atoms. `CaCl₂` is calcium chloride because calcium is a metal ion and chloride is the negative ion; the subscript balances charge rather than becoming a prefix in the ionic name.",
						"**Output:** A two-column formula/name table with at least eight examples and one explanation of why ionic and covalent naming rules differ.",
						"**CER checkpoint:** Explain why `MgCl₂` is not called magnesium dichloride in the introductory ionic naming model."
					].join("\n\n"),
					datasetLink: material("nomenclature-practice-cards"),
					solutionLink: answerKey("nomenclature-key")
				},
				{
					title: "Molecular Shape and Polarity",
					content: [
						"**Concept path:** Molecular shape depends on how bonded atoms and lone pairs arrange around a central atom. Electron regions repel and spread out, so a formula such as `H₂O` or `CO₂` is not enough by itself to describe geometry. Shape affects polarity, and polarity influences properties such as dissolving, boiling point, and interactions with other molecules. A molecule can contain polar bonds but still have an overall shape that makes those bond effects cancel, so shape and symmetry must be considered alongside formula.",
						"**Use this section:** Move from formula to structure to shape. Start with atom count, then identify the central atom when relevant, count bonded atoms and lone pairs, predict or observe the shape, and finally discuss polarity or property consequences. Keep a separate note for what the 2D drawing suggests versus what the 3D model shows.",
						"**Remote investigation:** Use the PhET Molecule Shapes simulation to compare linear, bent, trigonal planar, and tetrahedral arrangements. Record how lone pairs change shape.",
						"**Reasoning focus:** A formula gives atom counts, but electron regions explain shape. Lone pairs take space, bonded atoms arrange around the central atom, and a molecule's shape can make bond polarity add together or partially cancel.",
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
						"**Analysis target:** Add names for at least eight of the sorted formulas and flag any naming rule used. This keeps formula writing, bonding model, and nomenclature connected instead of separate memorization tasks.",
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
						"**Concept path:** Temperature is related to the average kinetic energy, or average motion, of particles, while total thermal energy also depends on how much matter is present. A small cup of hot water can have a higher temperature than a bathtub of warm water, but the bathtub can contain more total thermal energy because it has many more particles. This distinction matters for heating, cooling, phase changes, and gas behavior. Heating does not make particles larger; it generally increases motion or changes how particles are arranged and attracted.",
						"**Use this section:** Translate every temperature statement into a particle-motion statement, then ask whether amount of matter also matters. For comparisons, identify whether the question is about average particle motion or total energy in the sample. This helps avoid the common mistake that hotter always means more total energy.",
						"**Remote investigation:** Use the States of Matter simulation to compare particle motion before and after heating or cooling. Describe changes in motion without claiming particles themselves get bigger.",
						"**Reasoning focus:** Temperature is an average-motion measure, so two samples at the same temperature can contain different total thermal energy if their amounts differ. This distinction matters when interpreting heating curves, phase changes, and gas behavior.",
						"**Output:** A before/after particle-motion explanation with vocabulary for temperature, thermal energy, motion, amount of matter, and phase.",
						"**CER checkpoint:** Explain why heating usually increases particle motion."
					].join("\n\n"),
					mediaLink: SIMULATIONS.statesOfMatter
				},
				{
					title: "Phase Changes and Energy Transfer",
					content: [
						"**Concept path:** Phase changes are physical changes caused by energy transfer and changing particle arrangement. Melting, freezing, vaporization, condensation, sublimation, and deposition change how particles move, how far apart they are, and how strongly they are held together, but the substance identity remains the same during ordinary phase change. During a phase change, added or removed energy may change arrangement rather than temperature, which is why heating curves can have flat regions. This helps explain why boiling water is still water rather than a chemical decomposition into new substances.",
						"**Use this section:** Read phase changes as energy-and-arrangement changes. For each transition, name the starting state, ending state, direction of energy transfer, and what happens to spacing or motion. When reading a heating curve, describe sloped regions as temperature changes and flat regions as phase changes where energy is still being transferred.",
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
						"**Concept path:** Intermolecular attractions are forces between particles, not the covalent or ionic bonds inside a particle. These attractions influence boiling point, evaporation rate, surface tension, viscosity, and solubility because particles with stronger attractions are harder to separate or rearrange. Introductory work focuses on comparing stronger and weaker attractions and connecting them to observable properties. The goal is not to memorize every force category immediately, but to reason that structure and polarity affect how particles interact in bulk matter.",
						"**Use this section:** Link structure to attraction, then attraction to property. For each substance, identify what evidence suggests stronger or weaker attractions, then predict a property such as boiling point, evaporation rate, or solubility. Make the reasoning explicit: stronger attractions usually require more energy to separate particles, so they often raise boiling point or slow evaporation.",
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
						"**Concept path:** A phase diagram maps which state of a substance is stable at different combinations of temperature and pressure. Each region represents solid, liquid, or gas behavior, while boundary lines represent conditions where two phases can coexist or change into one another. The diagram is not a particle picture and it is not universal for all substances; it is a condition map for a specific substance. Reading a phase diagram requires naming both coordinates before making a claim, because changing pressure can matter just as much as changing temperature.",
						"**Use this section:** Read phase diagrams by coordinates. First locate temperature and pressure, then identify the region or boundary, then describe what state or transition the point represents. For changed-condition questions, trace the path on the diagram before naming the result. Do not transfer one substance's phase diagram to another without evidence.",
						"**Remote-safe activity:** Read a simplified phase diagram and identify solid, liquid, gas, melting, boiling, and sublimation regions. Compare what changes when pressure increases or temperature decreases.",
						"**Reading habit:** State both coordinates before naming a phase. A point on a boundary should be described as a transition condition rather than forced into only one region. The diagram is substance-specific, so the same temperature and pressure can mean different phases for different substances.",
						"**Output:** Three phase-diagram coordinate questions, one boundary interpretation, and one changed-condition prediction.",
						"**CER checkpoint:** Explain why pressure can matter for phase, not only temperature."
					].join("\n\n"),
					datasetLink: material("phase-diagram-data"),
					solutionLink: answerKey("phase-diagram-key")
				},
				{
					title: "Gas Pressure, Volume, Temperature, and Collisions",
					content: [
						"**Concept path:** Gas behavior is modeled through particles moving freely and colliding with container walls and each other. Pressure comes from wall collisions, volume is the available space, temperature relates to average particle speed, and amount of gas changes how many particles are present to collide. Gas laws summarize patterns among these variables, but the particle-collision model explains why the patterns happen. If volume decreases while amount and temperature stay similar, collisions happen more often in a smaller space; if temperature increases, particles move faster and collide more forcefully.",
						"**Use this section:** Use controlled-variable reasoning. Change one variable at a time, record what happens to pressure, volume, temperature, or particle amount, and explain the result through collisions. A useful template is: variable changed, variable held constant, visible or numerical result, collision-level explanation.",
						"**Remote investigation:** Use the PhET Gas Properties simulation to compare what happens when temperature, volume, particle amount, or container size changes. Keep one variable controlled when testing another so the pattern is interpretable.",
						"**Worked example:** If volume decreases while particle amount and temperature stay similar, particles collide with the walls more often, so pressure rises in the simplified model. If temperature rises in a fixed volume, faster particles create stronger and more frequent collisions.",
						"**Output:** A gas-variable table with four rows: change temperature, change volume, change amount, and hold a variable constant. Each row should include prediction, observation, and collision-level reasoning.",
						"**CER checkpoint:** Explain why a gas-law pattern is a particle-collision model rather than only a memorized equation."
					].join("\n\n"),
					datasetLink: material("gas-law-scenarios"),
					mediaLink: SIMULATIONS.gasProperties
				},
				{
					title: "Checkpoint: Energy, Phase Change, and Gases",
					content: [
						"**Checkpoint goal:** Connect particle motion, energy transfer, phase diagrams, and gas-variable reasoning into one coherent model.",
						"**Tasks:** Interpret one heating-curve segment, one phase-diagram coordinate, one intermolecular-property prediction, and one gas-variable scenario. Each answer should state the visible or numerical evidence and then translate it into a particle-level explanation.",
						"**Mastery evidence:** A complete response distinguishes temperature from total thermal energy, phase change from chemical reaction, pressure from temperature, and attraction strength from molecule identity.",
						"**Revision trigger:** If an answer says particles expand, disappear, or change identity during ordinary heating, return to the particle-motion and phase-change examples before continuing."
					].join("\n\n"),
					datasetLink: material("energy-phase-and-gas-checkpoint"),
					solutionLink: answerKey(
						"energy-phase-and-gas-checkpoint-key"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Heating Curve Explanation",
					content: [
						"**Project goal:** Explain a heating curve as both a graph and a particle story.",
						"**Requirements:** Label each region, describe particle motion or arrangement, and state where phase changes occur. Include at least one sentence explaining why energy transfer can continue while the temperature is flat.",
						"**Analysis target:** Include one incorrect interpretation and repair it. Good examples include treating flat regions as no energy transfer, treating boiling as chemical decomposition, or claiming particles grow larger when heated.",
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
						"**Concept path:** A chemical reaction rearranges atoms into new substances while conserving the atoms themselves. Reactants are the starting substances, products are the substances formed, and the evidence for reaction must be interpreted in context. Gas production, temperature change, color change, light, precipitate formation, odor change, or new properties can support a reaction claim, but no single clue is automatically conclusive. Boiling can produce bubbles without forming a new substance, while a particle diagram or equation can show when gas bubbles represent a product. Good reaction reasoning combines visible evidence with a particle-level or equation-based explanation.",
						"**Use this section:** Identify reactants and products before interpreting evidence. For each scenario, list the visible clue, then ask whether the clue shows a new substance or could be explained physically. Strong answers connect at least two evidence sources, such as a visible change plus a particle diagram, equation, or property comparison.",
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
						"**Concept path:** A balanced chemical equation shows conservation of atoms during a reaction. Coefficients tell how many particles, molecules, or formula units participate, while subscripts are part of each substance's formula and identity. Balancing means changing coefficients until every element has the same number of atoms on both sides. Changing a subscript would create a different substance, so it is not a valid balancing move. This rule is the bridge between particle diagrams and quantitative stoichiometry: the equation must describe the same reaction before it can be used for ratios.",
						"**Use this section:** Balance equations with a visible atom-count table. Write the unbalanced equation, count each element on both sides, change one coefficient, and recount. Leave subscripts unchanged. When the equation balances, write a final conservation statement explaining how the same atoms appear on both sides in different arrangements.",
						"**Remote investigation:** Use the PhET Balancing Chemical Equations simulation to balance simple reactions and compare particle, bar chart, and scale views.",
						"**Balancing habit:** Start by counting atoms on both sides, change only coefficients, and re-count after every change. If a subscript changes, the substance has changed and the equation no longer represents the same reaction.",
						"**Output:** Five balanced equations with atom counts before and after, including one corrected mistake where a coefficient was used instead of changing a formula.",
						"**CER checkpoint:** Explain why changing a subscript is not a valid way to balance an equation."
					].join("\n\n"),
					mediaLink: SIMULATIONS.balancingEquations
				},
				{
					title: "Reaction Types and Patterns",
					content: [
						"**Concept path:** Reaction types are pattern labels that help organize how atoms and ions rearrange. Synthesis combines simpler substances into a more complex product, decomposition breaks one substance into simpler products, single replacement and double replacement exchange partners, combustion involves a fuel reacting with oxygen, precipitation forms an insoluble solid, and acid-base reactions involve proton or ion-transfer patterns depending on the model used. These labels are useful because they guide prediction and evidence, but they do not replace balancing or observation. A reaction type should summarize what the equation and evidence already support.",
						"**Use this section:** Treat reaction type as a classification argument. First inspect the reactants and products, then identify the rearrangement pattern, then name the reaction type, and finally cite the evidence that supports that label. If a reaction could fit more than one introductory pattern, explain the stronger evidence instead of relying on the label alone.",
						"**Remote-safe activity:** Sort the reaction type cards by pattern. The goal is pattern recognition and evidence, not advanced prediction rules.",
						"**Worked example:** `CH₄ + 2O₂ → CO₂ + 2H₂O` is combustion because a carbon-containing fuel reacts with oxygen and forms carbon dioxide and water.",
						"**Reasoning focus:** Reaction type is a summary of the rearrangement pattern, not a replacement for evidence. A precipitation label should connect to an insoluble solid forming; a combustion label should connect to fuel, oxygen, and common products in the introductory model.",
						"**Output:** A reaction-type chart with one reason for each classification and one uncertain reaction where more evidence is needed.",
						"**CER checkpoint:** Explain how a reaction type helps summarize what changed."
					].join("\n\n"),
					datasetLink: material("reaction-type-cards"),
					solutionLink: answerKey("reaction-type-key")
				},
				{
					title: "Limiting Reactants and Leftovers",
					content: [
						"**Concept path:** A limiting reactant is the reactant that runs out first and therefore limits how much product can form. The limiting reactant is not necessarily the substance with the smaller starting amount; it depends on the balanced-equation ratio. Leftover reactants remain because they were present in more than the needed ratio. This reasoning is the chemistry version of recipe logic: if the recipe requires two pieces of bread for one slice of cheese, the number of sandwiches depends on the limiting ingredient, not the largest pile of ingredients. In chemical reactions, coefficients provide the recipe.",
						"**Use this section:** Solve limiting-reactant scenarios by complete product groups. Write the needed ratio, compare the available amounts to that ratio, identify which reactant runs out first, then calculate leftovers. After the analogy makes sense, repeat the same structure with a chemical equation where coefficients supply the ratio.",
						"**Remote investigation:** Use the PhET Reactants, Products and Leftovers simulation to build sandwich-style analogies and chemical-reaction examples. Record which reactant limits production and what remains.",
						"**Reasoning focus:** The limiting reactant is not always the reactant with the smaller starting number. The balanced ratio decides how many complete product groups can be made. Leftovers are unreacted starting material, not partial products.",
						"**Output:** Three limiting-reactant scenarios with reactant amounts, product amount, limiting reactant, leftovers, and the ratio used to decide.",
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
						"**Analysis target:** Organize the portfolio by difficulty. Begin with one-element balance checks, then move to equations with two compounds, then include at least one equation where a polyatomic group can be counted as a unit if it appears unchanged on both sides.",
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
						"**Concept path:** A solution is a homogeneous mixture in which particles of one or more solutes are evenly dispersed through a solvent. The solute is the substance being dissolved, the solvent is the substance doing the dissolving, and the solution is the combined mixture. A clear or uniform appearance does not prove a sample is a pure substance; salt water and sugar water can look uniform while still being mixtures. Concentration describes how much solute is present relative to the amount of solution or solvent, so solution vocabulary connects directly to later quantitative reasoning.",
						"**Use this section:** Label each part of a solution example. Identify the solute, solvent, whole solution, and evidence that the mixture is homogeneous. Then add a non-example or uncertain example to test the definition. A good solution explanation should make clear whether it is discussing composition, visible uniformity, or concentration.",
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
						"**Concept path:** Concentration is a ratio comparing solute amount to solution amount. A dilute solution has relatively little solute per amount of solution, while a concentrated solution has more. Saturation adds the idea of a dissolving limit under specific conditions: unsaturated solutions can dissolve more solute, saturated solutions hold about as much as they can under those conditions, and supersaturated solutions contain more dissolved solute than expected and are often unstable. Because concentration is a ratio, adding solvent can lower concentration without removing solute, and adding solute can increase concentration only if the solute actually dissolves.",
						"**Use this section:** Reason with numerator and denominator. For each scenario, mark whether solute amount changes, solution volume changes, or both change. Then decide whether concentration increases, decreases, stays the same, or cannot be determined from the information given. Use saturation language only when there is evidence about the dissolving limit.",
						"**Remote investigation:** Use the PhET Concentration simulation to change solute amount and solution volume. Watch how color intensity, concentration reading, and saturation state change.",
						"**Reasoning focus:** Concentration is a ratio, so the direction of change depends on both numerator and denominator. Saturation adds a second idea: at a given condition, there may be a maximum amount that dissolves before extra solute remains undissolved.",
						"**Output:** A variable table showing how concentration changes when solute increases, solvent increases, both change, or visible excess solute appears.",
						"**CER checkpoint:** Explain why adding water can lower concentration even though the solute has not disappeared."
					].join("\n\n"),
					mediaLink: SIMULATIONS.concentration
				},
				{
					title: "Molarity as a Quantitative Concentration",
					content: [
						"**Concept path:** Molarity is a quantitative concentration unit defined as moles of solute per liter of solution, written as `M` or `mol/L`. It connects the particle-counting unit of the mole to a measurable volume of solution. The ratio matters: increasing moles of solute raises molarity if volume stays constant, increasing volume lowers molarity if moles stay constant, and changing both can leave the ratio unchanged. Molarity prepares for stoichiometry because reactions depend on particle amounts, while solutions are often measured by volume.",
						"**Use this section:** Write molarity as a fraction before calculating: moles of solute over liters of solution. Predict the direction of change before reading or computing the value. If both moles and liters change, compare the ratio rather than assuming the larger number controls the answer.",
						"**Remote investigation:** Use the PhET Molarity simulation to change moles of solute and liters of solution. Predict whether molarity rises, falls, or stays the same before reading the value.",
						"**Worked example:** `0.50 mol` of solute in `1.0 L` of solution has a molarity of `0.50 M`. If the solute doubles to `1.00 mol` while volume stays `1.0 L`, molarity doubles; if both solute and volume double, the ratio stays the same.",
						"**Output:** Four molarity-change predictions with checked results and one calculation that shows moles divided by liters.",
						"**CER checkpoint:** Explain why doubling both moles and volume can leave molarity unchanged."
					].join("\n\n"),
					mediaLink: SIMULATIONS.molarity
				},
				{
					title: "Acids, Bases, and pH",
					content: [
						"**Concept path:** pH describes how acidic or basic an aqueous solution is using a logarithmic scale related to hydrogen-ion or hydronium-ion concentration. In the common introductory model at ordinary conditions, pH values below 7 are acidic, values near 7 are neutral, and values above 7 are basic. Because the scale is logarithmic, a one-unit pH change represents a tenfold change in acidity-related particle concentration, not a small linear step. Safe pH work relies on simulations, data, and references rather than tasting or mixing substances. Dilution usually moves an acidic or basic solution toward neutral because the relevant particles are spread through more solvent, but dilution does not erase the solute identity.",
						"**Use this section:** Read pH with both category and scale in mind. First classify the solution as acidic, neutral, or basic using evidence; then note that differences on the scale are multiplicative rather than ordinary equal steps. For dilution examples, describe how concentration changes before describing how pH moves. Avoid sensory claims such as taste, smell, or skin feel unless a provided evidence source specifically supports the conclusion.",
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
						"**Analysis target:** Include one controlled comparison where only one variable changes and one confounded comparison where two variables change. The conclusion should identify which comparison gives stronger evidence and why.",
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
						"**Concept path:** A mole is a counting unit used to connect invisible particle-scale amounts to measurable lab-scale quantities. Like a dozen always means 12 items, a mole means a fixed number of particles, Avogadro's number, about `6.022 × 10²³`. The mole is necessary because atoms, ions, and molecules are far too small to count one by one in ordinary work, but chemical reactions depend on particle ratios. Learning the mole means learning when a problem is about particles, when it is about grams, and how to move between those scales using molar mass.",
						"**Use this section:** Begin with counting analogies, then move to chemistry quantities. Write what is being counted before using the word mole: atoms, molecules, ions, or formula units. Keep the scale idea visible by comparing ordinary counts, dozens, and moles, then explain why chemical formulas and equations need a particle-counting unit.",
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
						"**Concept path:** Molar mass is the mass of one mole of a substance, usually expressed in grams per mole. Periodic-table atomic masses provide the values used to calculate molar mass from a chemical formula. For an element, the molar mass comes from its atomic mass; for a compound, the molar mass is the sum of each element's contribution multiplied by its subscript. Molar mass is the bridge between measurable grams and chemical particle amount, which is why unit conversions must keep `g`, `mol`, and `g/mol` visible.",
						"**Use this section:** Calculate molar mass formula-first. List each element, read its subscript, multiply by the periodic-table mass, add the contributions, and attach `g/mol`. For conversions, set up the unit cancellation before arithmetic so grams-to-moles and moles-to-grams do not get reversed.",
						"**Remote-safe activity:** Calculate molar masses for `H₂O`, `CO₂`, `NaCl`, `O₂`, and `CaCO₃` using a periodic table and the practice set. Keep units visible at every step.",
						"**Worked example:** `H₂O` has two hydrogens and one oxygen. With approximate masses H = 1 and O = 16, the molar mass is `2(1) + 16 = 18 g/mol`.",
						"**Conversion habit:** Write the starting unit, target unit, and conversion factor before doing arithmetic. The unit `g/mol` means grams per mole, so a grams-to-moles conversion divides by molar mass while a moles-to-grams conversion multiplies by molar mass.",
						"**Output:** Five molar-mass calculations, two grams-to-moles conversions, and one moles-to-grams conversion with units canceling visibly.",
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
						"**Concept path:** Stoichiometry uses a balanced chemical equation as a ratio map. The coefficients in the equation create mole ratios between reactants and products, and those ratios are only valid after the equation is balanced. Subscripts describe formula composition, while coefficients describe reacting amounts, so the mole ratio comes from coefficients rather than from atom counts inside a formula. Once the mole ratio is known, it can connect moles of one substance to moles of another, and with molar mass it can connect grams to grams.",
						"**Use this section:** Highlight the balanced equation before solving. Circle the known substance, underline the target substance, and write the coefficient ratio between them. If the target unit is not moles, do not use the ratio until the known amount has been converted to moles. This keeps formula subscripts, coefficients, and unit conversions in their proper roles.",
						"**Remote-safe activity:** Read a balanced equation from the practice set and identify all usable mole ratios. Use simple one-step conversions before combining with grams.",
						"**Worked example:** In `2H₂ + O₂ → 2H₂O`, the ratio from oxygen to water is `1 mol O₂ : 2 mol H₂O`. The ratio comes from coefficients, not subscripts.",
						"**Reasoning focus:** A mole ratio is only valid after the equation is balanced. Subscripts describe formula composition; coefficients describe reacting amounts. Confusing those two roles causes many stoichiometry errors.",
						"**Output:** Four mole-ratio problems with the ratio highlighted before calculation, including one problem where the ratio must be inverted to match the target unit.",
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
						"**Concept path:** A stoichiometry solution is a chain of reasoning, not just arithmetic. A complete answer begins with a balanced equation, identifies the known amount, converts to moles when needed, applies the correct coefficient ratio, converts to the requested unit, and checks whether the result is reasonable. Limiting-reactant problems add another decision: more than one starting reactant may need to be tested to see which one controls product amount. Units are not decoration in this process; they reveal whether each conversion step is valid and whether the final number answers the actual question.",
						"**Use this section:** Use a checklist for every quantitative problem: balanced equation, known value, target value, molar mass if grams are involved, mole ratio from coefficients, final unit, and reasonableness. When diagnosing an error, find the first invalid step rather than only marking the final answer wrong. This builds a method that transfers to unfamiliar equations.",
						"**Remote-safe activity:** Solve two guided problems: one moles-to-moles and one grams-to-grams. Mark the equation, known value, conversion factor, target unit, and final reasonableness check. Then compare with one flawed solution from the error-case table.",
						"**Worked example:** A grams-to-grams problem must convert grams to moles, use the balanced-equation mole ratio, then convert moles to grams. Skipping the middle mole step usually means the coefficients are being used incorrectly.",
						"**Graduated practice:** Begin with coefficient-only ratio questions, then moles-to-moles, then grams-to-moles, and finally grams-to-grams. Only add limiting-reactant reasoning after the equation ratio is already clear.",
						"**Output:** Two fully annotated stoichiometry solutions and one repaired flawed solution from the error-case table.",
						"**CER checkpoint:** Explain why dimensional analysis is a reasoning tool rather than a formatting trick."
					].join("\n\n"),
					datasetLink: material("stoichiometry-error-cases"),
					solutionLink: answerKey("stoichiometry-error-key")
				},
				{
					title: "Checkpoint: Quantitative Chemistry Reasoning",
					content: [
						"**Checkpoint goal:** Check whether mole, molar mass, equation ratio, unit conversion, and reasonableness checks are connected instead of memorized as separate formulas.",
						"**Tasks:** Complete one molar-mass calculation, one grams-to-moles conversion, one mole-ratio conversion, one grams-to-grams setup, and one error diagnosis. Write the unit at every step and circle the conversion factor that came from the balanced equation.",
						"**Mastery evidence:** A complete response identifies when the periodic table is used, when the balanced equation is used, and when a final answer should be rejected because the unit or magnitude is unreasonable.",
						"**Revision trigger:** If coefficients are applied directly to grams, or if the equation is never balanced before a ratio is used, return to the graduated practice sequence."
					].join("\n\n"),
					datasetLink: material("quantitative-chemistry-checkpoint"),
					solutionLink: answerKey(
						"quantitative-chemistry-checkpoint-key"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Molar Mass Reference Sheet",
					content: [
						"**Project goal:** Build a reference sheet that explains molar mass through examples instead of listing formulas alone.",
						"**Requirements:** Include at least eight compounds, show element-by-element contributions, and include one common mistake to avoid. At least two examples should come from the practice set and at least two should be chosen independently from formulas already used in the course.",
						"**Analysis target:** Include one ionic compound, one covalent molecule, one formula with parentheses if ready, and one example where a coefficient in an equation should not be included in the molar mass of a single formula unit.",
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
						"**Concept path:** Reaction energy and reaction rate answer different questions. Some reactions release energy to the surroundings, some absorb energy, and all reactions require particles to collide with enough energy and a useful orientation before bonds can rearrange. Rate describes how quickly reactants become products; energy describes what is transferred, required, or released. A reaction can be energetically favorable but slow if useful collisions are rare, and a faster reaction is not automatically more complete. Temperature, concentration, surface area, and catalysts can affect rate by changing collision frequency, collision energy, or reaction pathway.",
						"**Use this section:** Separate energy claims from rate claims. Write one sentence about what energy evidence appears, such as heat, light, or cooling, and a separate sentence about how quickly the change occurs. If a factor such as temperature or catalyst is changed, explain whether it affects collision energy, collision frequency, or pathway.",
						"**Remote-safe activity:** Compare two reaction descriptions from the materials pack: one that is warmed, cooled, or catalyzed, and one that releases heat or light. Identify the evidence for energy transfer, the evidence for rate change, and the limits of the description.",
						"**Worked example:** A glow stick emits light and changes brightness over time. The light is evidence of energy transfer, while the fading brightness is evidence about rate and reactant use.",
						"**Output:** A two-column explanation separating energy evidence from rate evidence.",
						"**CER checkpoint:** Explain why a reaction can be energetically favorable but still slow without enough useful collisions."
					].join("\n\n"),
					datasetLink: material("reaction-energy-and-rate-cases"),
					solutionLink: answerKey("reaction-energy-and-rate-key")
				},
				{
					title: "Equilibrium as Dynamic Balance",
					content: [
						"**Concept path:** Equilibrium is dynamic balance, not stillness. At equilibrium, forward and reverse processes continue, but their rates are balanced so the visible or measured amounts remain stable under constant conditions. This idea appears in saturated solutions where dissolving and crystallizing can both occur, carbonated drinks where gas dissolves and escapes depending on pressure, closed-system phase changes, and weak acid/base behavior. Changing temperature, pressure, concentration, or volume can disturb the balance and lead the system toward a new equilibrium condition.",
						"**Use this section:** Draw equilibrium as two arrows, not as a stopped process. Label the forward process, reverse process, condition being changed, and expected response. In every example, distinguish the system being at balance from the system being inactive; particles or processes may still be changing even when the measured amount looks constant.",
						"**Remote-safe activity:** Use the carbonation or saturation evidence seed to build a before/after/changed-condition explanation. Predict what changes when pressure, temperature, concentration, or volume changes.",
						"**Worked example:** A sealed carbonated drink keeps more dissolved carbon dioxide under pressure. Opening the container changes the system, so gas leaves solution until a new condition is reached.",
						"**Output:** A dynamic-balance diagram with forward process, reverse process, changed condition, and predicted shift.",
						"**CER checkpoint:** Explain why equilibrium is not the same as nothing happening."
					].join("\n\n"),
					datasetLink: material("equilibrium-evidence-cases"),
					solutionLink: answerKey("equilibrium-key")
				},
				{
					title: "Redox, Batteries, and Electron Transfer",
					content: [
						"**Concept path:** Oxidation-reduction, or redox, reactions involve electron transfer or changes in electron ownership. Oxidation is associated with losing electrons or becoming more positively charged, while reduction is associated with gaining electrons or becoming more negatively charged. A full electrochemistry course adds more precision, but an introductory model can already connect redox to rusting, corrosion, batteries, metal-ion changes, and energy transfer. The key idea is that redox is not merely any reaction; it specifically tracks electron movement or electron-density changes.",
						"**Use this section:** Track electron ownership explicitly. Identify what substance changes, whether it loses or gains electron density in the simplified model, and what visible evidence shows the change. Use redox language only when electron transfer or charge/oxidation-state change is part of the explanation, not as a generic synonym for reaction.",
						"**Remote-safe activity:** Read a simple battery or rusting evidence seed. Track which particle or substance loses electron density, which gains it, and how the change can move energy through a system.",
						"**Worked example:** In rusting, iron atoms become iron ions in compounds with oxygen. The visible rust is evidence of a new substance, while the electron-transfer model explains why oxidation language is useful.",
						"**Output:** A redox story map with substance before, substance after, electron-transfer idea, and visible evidence.",
						"**CER checkpoint:** Explain why redox is more specific than simply saying a chemical reaction happened."
					].join("\n\n"),
					datasetLink: material("redox-evidence-cases"),
					solutionLink: answerKey("redox-key")
				},
				{
					title: "Nuclear, Organic, and Materials Chemistry Boundaries",
					content: [
						"**Concept path:** Chemistry branches into specialized areas that use the same evidence habits but focus on different systems. Nuclear chemistry involves changes in atomic nuclei, so it is different from ordinary chemical reactions that rearrange electrons and bonds. Organic chemistry studies carbon-based structures and reactions, especially how functional groups and molecular shape affect behavior. Materials chemistry connects particle structure, bonding, and arrangement to bulk properties such as strength, flexibility, conductivity, and durability. This intro course names these boundaries so later study has a map without pretending each advanced field has been fully covered.",
						"**Use this section:** Classify advanced questions by what part of matter changes or what evidence is needed. If nuclei change, label the topic nuclear; if carbon structure and functional groups dominate, label it organic; if bulk properties depend on structure and processing, label it materials chemistry. Then name which intro-course tools still help and which deeper tools would be needed next.",
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
						"**Analysis target:** The card should explicitly separate what this course can already explain from what a later course would need. For example, a battery card can use redox language and energy transfer, but detailed electrode potentials belong in a deeper chemistry or physics-connected course.",
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
						"**Analysis target:** Tie each path to specific evidence from the course. Strong ratio work may point toward quantitative chemistry; strong structure-property explanations may point toward materials chemistry or organic foundations.",
						"**Completion checks:** The recommendation distinguishes what has been mastered from what has only been previewed and names one concrete next project."
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
						"**Concept path:** A capstone phenomenon should be specific enough to explain with course concepts and available evidence. Broad topics such as food, batteries, or pollution are too large unless they are narrowed into a claim such as why carbonation changes after pressure is released, how ions contribute to hard-water deposits, or why corrosion produces a new substance. Good capstone choices connect visible evidence to particle models, formulas, equations, concentration, energy, or structure-property reasoning. The topic must also be safe for remote work, which means provided evidence, simulations, diagrams, public references, or nonphysical observations should be enough to support the explanation.",
						"**Use this section:** Narrow the topic before gathering evidence. Write a broad topic, convert it into a specific question, name the chemistry concepts that can answer it, and check whether safe evidence is available. If the topic requires materials, tasting, heating, or unsupported claims, revise it until the explanation can be built from course-safe evidence.",
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
						"**Concept path:** A strong chemistry explanation uses more than one type of evidence and makes clear how each source supports the claim. Observation can show what changed, a diagram can show a particle model, a data table can show a pattern, a simulation can test a variable, an equation can show conservation or ratios, and an authoritative reference can define or confirm a property. Evidence must be relevant, not merely related to the topic. A photo without context, a general website paragraph, or a simulation setting that does not match the claim should be treated as weak evidence until the connection is explained.",
						"**Use this section:** Build an evidence log with four columns: source, what it shows, how it supports the claim, and limitation. Include at least one model-based source and one data or reference source when possible. Reject or revise evidence that cannot be connected to the claim in a direct sentence.",
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
						"**Concept path:** A complete chemistry explanation connects vocabulary, particle-level model, formula or equation when relevant, evidence, and a changed-condition prediction. Vocabulary gives the explanation precision, but terms must be used accurately and tied to evidence. The particle model explains why the visible evidence occurs, while formulas, equations, graphs, or data tables add structure and accountability. A changed-condition prediction shows whether the model can be used, not only repeated. The final explanation should be self-contained enough that another reader can understand and challenge the claim without private notes.",
						"**Use this section:** Draft in sections before writing the final paragraph. Start with the claim, add the most relevant evidence, explain the particle or system model, insert formulas or equations where they clarify the reasoning, define key vocabulary in context, and end with a prediction. Then revise so the final explanation reads smoothly without losing the evidence chain.",
						"**Remote-safe activity:** Draft a CER-based capstone explanation. Use course concepts from at least four modules, such as atoms, periodic table, bonding, phase change, reactions, solutions, or stoichiometry.",
						"**Writing habit:** Each paragraph should do one job: define the phenomenon, present evidence, explain the particle or system model, connect vocabulary, and state what would change under a new condition. If a term appears, it should either be defined or used in a way the evidence supports.",
						"**Output:** A structured explanation with claim, evidence, reasoning, model, vocabulary, and prediction sections.",
						"**CER checkpoint:** Check whether every claim has evidence and whether every vocabulary term is used accurately."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
				},
				{
					title: "Presentation, Revision, and Reflection",
					content: [
						"**Concept path:** Scientific communication improves through revision because explanations become stronger when claims, evidence, models, and limits are made more precise. A good final version states the question, narrows the claim, explains the particle or system model, cites evidence, names uncertainty, and identifies what would be tested or compared next. Revision is not only proofreading; it can mean replacing weak evidence, correcting a formula, narrowing an overbroad claim, adding units, improving a diagram, or naming a limitation. Strong communication makes the reasoning easy to inspect rather than hiding uncertainty.",
						"**Use this section:** Revise with a purpose. Choose one revision target at a time: claim clarity, evidence quality, model accuracy, vocabulary, units, limitation, or prediction. After each revision, write what changed and why it improves the explanation. The final reflection should name both a strengthened idea and a remaining question.",
						"**Remote-safe activity:** Present the capstone as slides, a short written report, or an annotated notebook page. Revise after feedback by strengthening evidence, clarifying vocabulary, or narrowing the claim.",
						"**Revision focus:** A useful revision changes the work, not only the wording. Good revisions add a missing evidence source, narrow an overbroad claim, replace a vague model, correct a unit or formula, or state uncertainty more precisely.",
						"**Output:** A final capstone artifact and a short reflection naming one strengthened idea and one remaining question.",
						"**CER checkpoint:** Explain what evidence would change the conclusion."
					].join("\n\n"),
					datasetLink: material("capstone-evidence-seeds"),
					solutionLink: answerKey("capstone-rubric")
				},
				{
					title: "Checkpoint: Capstone Defense",
					content: [
						"**Checkpoint goal:** Confirm that the final explanation is specific, source-backed, safe for remote work, and accurate enough to be challenged.",
						"**Tasks:** Answer four defense questions: What claim is being made? Which evidence directly supports it? Which particle, equation, graph, or system model explains the evidence? What result or new evidence would change the claim?",
						"**Mastery evidence:** A strong defense can identify a limitation without weakening the whole explanation. It can also distinguish a chemistry claim from a personal opinion, broad topic summary, or unsupported real-world anecdote.",
						'**Revision trigger:** If the capstone depends on a required physical experiment, an uncited image, or a broad topic such as "chemistry in food" without a narrowed claim, revise the scope before presenting.'
					].join("\n\n"),
					datasetLink: material("capstone-defense-checkpoint"),
					solutionLink: answerKey("capstone-rubric")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Chemistry Phenomenon Capstone",
					content: [
						"**Project goal:** Explain one real-world chemistry phenomenon using course concepts, evidence, and a particle-level model.",
						"**Requirements:** Include a claim, evidence log, particle/model explanation, at least four course vocabulary terms, one diagram or simulation reference, one changed-condition prediction, and one limitation. The final artifact should name which parts of the topic were covered in the intro course and which parts are advanced previews.",
						"**Analysis target:** The artifact should be narrow enough that another person could disagree with the claim using evidence. Replace broad topics with testable claims, such as pressure changing carbonation behavior, ions affecting hard-water deposits, or electron transfer explaining corrosion.",
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
						"**Analysis target:** Sort feedback into accuracy, evidence, clarity, and scope. Accuracy feedback corrects chemistry; evidence feedback asks for a source or data; clarity feedback improves explanation; scope feedback narrows or expands the claim.",
						"**Completion checks:** Feedback references the artifact directly and avoids vague comments such as good job or add more detail without naming what detail is missing."
					].join("\n\n"),
					datasetLink: REFERENCES.ngssAppendices,
					solutionLink: answerKey("capstone-rubric")
				}
			]
		},
		{
			kind: "appendix",
			title: "Reference Appendix: Chemistry Resource Bank",
			curriculum: [
				{
					title: "Core Chemistry References",
					content: [
						"**Reference purpose:** This appendix collects the recurring references used throughout the course. It is not a separate content unit by default; it supports standards, safety boundaries, periodic-table reading, units, equations, and evidence practices when a lesson or project calls for them.",
						"**Resource bank:** Use the ACS Chemistry Guidelines, ACS periodic table, NIST SI units page, NGSS appendices, OpenStax Chemistry 2e, and the local materials pack as reference material.",
						"**Use:** These links are not separate assignments by default. They support the specific lessons and projects that cite them.",
						"**Completion check:** Any reference used in a project should be named in the evidence log with a short note explaining what it contributed."
					].join("\n\n"),
					datasetLink: REFERENCES.openStaxChemistry,
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
					].join("\n\n"),
					datasetLink: material("remote-investigation-checklist"),
					solutionLink: answerKey("general-cer-rubric")
				},
				{
					title: "Chemistry Explanation Rubric",
					content: [
						"**Resource bank:** Strong explanations are assessed by claim clarity, evidence relevance, particle-model reasoning, accurate vocabulary, safe scope, and changed-condition prediction. The rubric categories are summarized here so checks stay consistent across projects.",
						"**Use:** Apply the rubric to project drafts before final submission. A weak explanation usually needs a narrower claim, better evidence, or a clearer model. The rubric is also a diagnostic tool: it should reveal which part of the explanation is weak rather than simply assigning a score.",
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
						"**Analysis target:** Write the card as a usable aid, not a summary paragraph. It should include a decision rule, a worked mini-example, and a warning that prevents a real mistake such as changing subscripts, dropping units, or using a model outside its limits.",
						"**Completion checks:** The card is useful during a later project without needing a separate explanation."
					].join("\n\n"),
					datasetLink: MATERIALS.pack,
					solutionLink: MATERIALS.answerKey
				}
			]
		}
	]
};
