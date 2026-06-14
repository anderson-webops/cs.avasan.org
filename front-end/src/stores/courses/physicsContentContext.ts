import type { RawCourse } from "./types";

interface PhysicsTopicContext {
	conceptPurpose: string;
	toolkitSetup: string;
	toolkitFormula: string;
	exampleCheck: string;
	representation: string;
	labSetup: string;
	labOutput: string;
	reflection: string;
	extension: string;
}

const defaultPhysicsTopicContext: PhysicsTopicContext = {
	conceptPurpose:
		"connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list.",
	exampleCheck:
		"Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result.",
	extension:
		"Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note.",
	labOutput:
		"The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption.",
	labSetup:
		"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case.",
	reflection:
		"State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger.",
	representation:
		"The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown.",
	toolkitFormula:
		"Use formulas only after the physical relationship is clear, with units and limitations stated explicitly.",
	toolkitSetup:
		"First name the system, quantities, assumptions, and expected direction of change."
};

const physicsTopicContexts: Record<string, PhysicsTopicContext> = {
	"PHY8 Momentum, Impulse, and Collisions": {
		conceptPurpose:
			"treat collision problems as system-boundary decisions: decide what interacts, what external impulse exists, and which quantity is conserved before calculating.",
		exampleCheck:
			"Each collision example should include before-and-after momentum totals, a force-time or impulse representation, and a short note on whether kinetic energy is conserved.",
		extension:
			"Include a before/after momentum table, force-time sketch, safety claim, and one limitation such as deformation, friction, or measurement uncertainty.",
		labOutput:
			"The final explanation should state the chosen system, the momentum evidence, the impulse connection, and one assumption about external forces.",
		labSetup:
			"Use a collision simulation, video frame data, toy impact scenario, or sports-safety design case where before-and-after quantities are visible.",
		reflection:
			"Compare a collision where momentum is the natural tool with one where energy tells the clearer story, then state what evidence would distinguish the two.",
		representation:
			"The representation should make before/after momentum, impulse area, or kinetic-energy change visible rather than hiding the event inside one equation.",
		toolkitFormula:
			"Use impulse and conservation equations only after direction, system boundary, and external forces are explicit.",
		toolkitSetup:
			"Begin by choosing the system, defining positive direction, separating before and after states, and identifying any outside impulse."
	},
	"PHY9 Rotational Motion and Torque Basics": {
		conceptPurpose:
			"make rotation problems hinge on pivot choice, perpendicular distance, and torque direction rather than on force size alone.",
		exampleCheck:
			"Each torque example should include a pivot mark, lever-arm distance, clockwise/counterclockwise sign choice, and a balance or angular-acceleration conclusion.",
		extension:
			"Include a pivot diagram, torque table, sign convention, design claim, and one limitation such as friction, flexing, or uncertain force location.",
		labOutput:
			"The final explanation should state the pivot, torque evidence, sign convention, and one assumption about rigidity or force placement.",
		labSetup:
			"Use a seesaw, door, wrench, balance-beam, or rotating-tool case that can be modeled with visible lever arms.",
		reflection:
			"Compare a force that creates large torque with a larger force that creates little torque, then explain what changed physically.",
		representation:
			"The representation should show pivot location, lever-arm geometry, torque direction, and whether net torque balances or accelerates rotation.",
		toolkitFormula:
			"Use torque equations only after the perpendicular lever arm and sign convention are clear.",
		toolkitSetup:
			"Begin by marking the pivot, locating each force, measuring the perpendicular lever arm, and choosing clockwise or counterclockwise as positive."
	},
	"PHY10 Fluids, Pressure, and Buoyancy": {
		conceptPurpose:
			"connect pressure, density, and displaced fluid so floating and sinking are explained by evidence rather than by the word heavy.",
		exampleCheck:
			"Each fluids example should include density comparison, pressure or force-area reasoning, displaced volume, and a claim about floating, sinking, or force multiplication.",
		extension:
			"Include a density/displacement model, pressure or force calculation, design claim, and one limitation such as shape, trapped air, or fluid variation.",
		labOutput:
			"The final explanation should state the density or pressure evidence, the displaced-fluid model, and one assumption about the fluid or object shape.",
		labSetup:
			"Use a sink-float dataset, boat-shape design, hydraulic-lift case, pressure-depth simulation, or paper model of displaced volume.",
		reflection:
			"Compare a case where total weight misleads with a case where density or displaced volume explains the outcome more clearly.",
		representation:
			"The representation should make pressure, area, density, displaced volume, or buoyant force visible as separate quantities.",
		toolkitFormula:
			"Use pressure, density, and buoyancy equations only after units, fluid choice, and displaced volume are identified.",
		toolkitSetup:
			"Begin by naming the fluid, object, relevant area or volume, density comparison, and force direction."
	},
	"PHY11 Heat, Temperature, and Thermal Energy": {
		conceptPurpose:
			"separate temperature, heat transfer, internal energy, and phase change so thermal reasoning is not reduced to hot versus cold.",
		exampleCheck:
			"Each thermal example should include the system, transfer pathway, relevant material property, and whether the evidence shows temperature change or phase change.",
		extension:
			"Include an energy-flow diagram, temperature or phase-change graph, design recommendation, and one limitation such as material variability or heat loss.",
		labOutput:
			"The final explanation should state the thermal pathway, evidence from a graph or comparison, and one assumption about insulation or surroundings.",
		labSetup:
			"Use a cooling curve, insulation comparison, heating-curve simulation, electronics heat case, or food-temperature design problem.",
		reflection:
			"Compare a situation where temperature changes with one where energy transfer happens during a phase change, then explain the evidence.",
		representation:
			"The representation should show energy flow, temperature change, phase plateau, or competing transfer pathways.",
		toolkitFormula:
			"Use thermal equations only after the material, mass, transfer direction, and phase condition are clear.",
		toolkitSetup:
			"Begin by naming the system, surroundings, transfer pathway, material property, and measured temperature or phase evidence."
	},
	"PHY12 Optics, Mirrors, Lenses, and Images": {
		conceptPurpose:
			"use ray evidence to explain image formation, focal length, and real versus virtual images instead of memorizing lens labels.",
		exampleCheck:
			"Each optics example should include a ray diagram, object position, focal point, image type, and a prediction about image size or orientation.",
		extension:
			"Include a ray diagram, device purpose, image prediction, design constraint, and one limitation such as lens thickness or imperfect alignment.",
		labOutput:
			"The final explanation should state the ray evidence, image type, focal relationship, and one assumption about ideal lenses or mirrors.",
		labSetup:
			"Use a lens or mirror simulation, camera or eyeglass case, telescope sketch, or projector-style image-distance table.",
		reflection:
			"Compare a real image case with a virtual image case, then explain which evidence tells the difference.",
		representation:
			"The representation should show ray paths, focal points, object/image positions, and whether rays actually converge.",
		toolkitFormula:
			"Use mirror or lens formulas only after the ray diagram and sign convention make the image type clear.",
		toolkitSetup:
			"Begin by marking the optical axis, focal point, object location, principal rays, and expected image side."
	},
	"PHY13 Magnetism and Electromagnetic Induction": {
		conceptPurpose:
			"connect current, magnetic fields, coils, and changing flux so motors and generators become energy-transfer systems rather than magic boxes.",
		exampleCheck:
			"Each electromagnetic example should include field direction, current or changing-flux evidence, device role, and energy transformation.",
		extension:
			"Include a field diagram, device block diagram, energy transformation, and one limitation such as coil resistance, friction, or field strength.",
		labOutput:
			"The final explanation should state the magnetic interaction, changing-field evidence if relevant, device function, and one simplifying assumption.",
		labSetup:
			"Use an electromagnet, motor, speaker, generator, relay, or wireless-charging case that shows current-field interaction.",
		reflection:
			"Compare a device that uses current to create magnetism with one that uses changing magnetism to create current.",
		representation:
			"The representation should show field direction, current direction, coil geometry, and where energy changes form.",
		toolkitFormula:
			"Use quantitative relationships only after field direction, current direction, and device role are clear.",
		toolkitSetup:
			"Begin by naming the source of the magnetic field, the conductor or coil, the motion or current, and the expected energy transfer."
	},
	"PHY14 Simple Harmonic Motion and Resonance": {
		conceptPurpose:
			"explain repeated motion through equilibrium, restoring force, period, damping, and resonance instead of treating oscillation as generic back-and-forth motion.",
		exampleCheck:
			"Each oscillation example should include equilibrium position, amplitude, period or frequency, energy transfer, and any damping or driving force.",
		extension:
			"Include an oscillation graph, resonance explanation, real-world case, and one limitation such as damping, nonlinear motion, or measurement noise.",
		labOutput:
			"The final explanation should state the equilibrium model, timing evidence, resonance or damping behavior, and one assumption about the system.",
		labSetup:
			"Use a pendulum, spring, swing, instrument, bridge, or resonance simulation where period and amplitude can be compared.",
		reflection:
			"Compare free oscillation with driven resonance, then explain why matching frequency can matter more than pushing harder.",
		representation:
			"The representation should show equilibrium, amplitude, period, frequency, and how energy or amplitude changes over time.",
		toolkitFormula:
			"Use period or frequency relationships only after equilibrium, restoring force, and small-motion assumptions are clear.",
		toolkitSetup:
			"Begin by locating equilibrium, identifying the restoring interaction, naming amplitude, and deciding what sets the timing."
	},
	"PHY15 Astronomy, Gravity, and Orbits": {
		conceptPurpose:
			"treat orbital motion as continuous free fall under gravity while keeping scale, frame of reference, and velocity direction explicit.",
		exampleCheck:
			"Each orbit example should include central body, distance scale, velocity direction, inward acceleration, and a reasonableness check against known space behavior.",
		extension:
			"Include an orbit diagram, gravity or velocity constraint, mission claim, and one limitation such as circular-orbit assumption or ignored atmosphere.",
		labOutput:
			"The final explanation should state the gravity model, orbital evidence, scale assumption, and one neglected interaction.",
		labSetup:
			"Use a satellite simulation, planetary data table, mission sketch, or weight-on-other-worlds comparison.",
		reflection:
			"Compare falling straight down with falling around a planet, then explain how velocity direction changes the outcome.",
		representation:
			"The representation should show central force direction, velocity tangent, orbit path, and relevant scale.",
		toolkitFormula:
			"Use gravity or orbital-speed relationships only after distance, mass, and frame assumptions are explicit.",
		toolkitSetup:
			"Begin by naming the central body, orbiting object, distance scale, velocity direction, and force direction."
	},
	"PHY16 Modern Physics and Model Limits": {
		conceptPurpose:
			"use spectra, photons, quantized energy, and model boundaries to show why classical physics is powerful but not universal.",
		exampleCheck:
			"Each modern-physics example should include the classical expectation, observed evidence, refined model, and the domain where each model works.",
		extension:
			"Include an old-model/new-model comparison, evidence source, explanatory diagram, and one limitation such as scale, energy range, or measurement precision.",
		labOutput:
			"The final explanation should state the old model, the evidence that strains it, the refined idea, and one boundary on the claim.",
		labSetup:
			"Use spectra, photoelectric-style threshold reasoning, solar cells, lasers, semiconductors, or GPS timing as evidence cases.",
		reflection:
			"Compare a case where the classical model remains useful with one where a refined model is necessary.",
		representation:
			"The representation should show energy levels, spectra, threshold behavior, or a clear boundary between model domains.",
		toolkitFormula:
			"Use equations only after the evidence and model domain explain why a classical shortcut is insufficient.",
		toolkitSetup:
			"Begin by naming the classical model, the observation, the scale or energy involved, and what the model fails to explain."
	},
	"PHY17 Engineering Design and Physics Portfolio": {
		conceptPurpose:
			"turn physics work into defensible engineering communication where claims, evidence, tradeoffs, and revision choices are visible.",
		exampleCheck:
			"Each portfolio example should include a design question, model choice, graph or diagram evidence, uncertainty, and a revision decision.",
		extension:
			"Include a portfolio map, selected evidence, design revision, limitation, and a short defense of why the final artifact is stronger than the first draft.",
		labOutput:
			"The final explanation should state the design claim, supporting model, evidence, uncertainty, and revision priority.",
		labSetup:
			"Use a portfolio artifact from motion, forces, circuits, collisions, waves, thermal systems, or space and revise it using evidence.",
		reflection:
			"Compare an early artifact with a revised artifact, then identify the evidence that most improved the argument.",
		representation:
			"The representation should connect claim, model, graph or diagram evidence, uncertainty, and design tradeoff.",
		toolkitFormula:
			"Use calculations only when they support the design claim and are paired with evidence and limits.",
		toolkitSetup:
			"Begin by choosing the artifact, naming its physics model, stating the claim, and identifying the weakest evidence link."
	},
	"PHY17 Numerical Modeling and Simulation Checks": {
		conceptPurpose:
			"treat simulations as models that need update rules, step-size checks, and comparisons against ideal cases before being trusted.",
		exampleCheck:
			"Each simulation example should include update rule, time step, initial conditions, graph output, and comparison to an ideal or analytic case.",
		extension:
			"Include ideal and corrected graphs, update-rule notes, step-size comparison, model claim, and one numerical limitation.",
		labOutput:
			"The final explanation should state the update rule, validation evidence, numerical limitation, and one physical assumption.",
		labSetup:
			"Use projectile motion with drag, iterative motion updates, energy tracking, or simulation-versus-ideal comparison.",
		reflection:
			"Compare a physical effect with a numerical artifact, then identify what test separates them.",
		representation:
			"The representation should show how changing time step, drag, or update rule changes the model output.",
		toolkitFormula:
			"Use formulas as update rules only after variables, time step, and validation target are defined.",
		toolkitSetup:
			"Begin by defining state variables, update rule, step size, initial values, and comparison baseline."
	},
	"PHY18 Experimental Uncertainty and Curve Fitting": {
		conceptPurpose:
			"make measurement uncertainty, residuals, and fitted models part of the conclusion rather than cleanup after plotting.",
		exampleCheck:
			"Each data example should include axis meaning, fit choice, residual pattern, uncertainty source, and a conclusion tied to slope or model shape.",
		extension:
			"Include raw data, fit graph, residual or uncertainty note, revised conclusion, and one measurement limitation.",
		labOutput:
			"The final explanation should state the fit model, slope or parameter meaning, uncertainty evidence, and one source of bias.",
		labSetup:
			"Use position-time, force-extension, current-voltage, or transformed-variable data where a fitted relationship can be evaluated.",
		reflection:
			"Compare a graph that looks convincing with one whose residuals reveal a model problem.",
		representation:
			"The representation should show scatter, trend, residuals, slope meaning, or systematic bias rather than only the final equation.",
		toolkitFormula:
			"Use fit equations only after axes, units, uncertainty, and residual behavior are understood.",
		toolkitSetup:
			"Begin by naming measured quantities, units, expected relationship, possible bias, and what residuals would reveal."
	},
	"PHY19 Coupled Systems and Constraints": {
		conceptPurpose:
			"show how connected systems require separate free-body diagrams plus constraint equations, not one oversized force picture.",
		exampleCheck:
			"Each coupled-system example should include separate bodies, shared constraints, tension or contact assumptions, and a consistency check across equations.",
		extension:
			"Include a constraint map, free-body diagrams, equation set, real-system comparison, and one limitation such as friction or rope mass.",
		labOutput:
			"The final explanation should state the constraint, object-level force evidence, equation link, and one assumption about the connection.",
		labSetup:
			"Use pulleys, elevators, linked carts, rods, strings, or mechanical linkages where motion is constrained between parts.",
		reflection:
			"Compare solving one object alone with solving the connected system, then identify which assumption links the parts.",
		representation:
			"The representation should show separate free-body diagrams, shared acceleration or displacement, and the equation that couples the objects.",
		toolkitFormula:
			"Use equations only after object boundaries and constraint relationships are stated.",
		toolkitSetup:
			"Begin by separating the objects, drawing forces on each, naming shared motion constraints, and identifying unknowns."
	},
	"PHY20 Fluids and Continuum Models": {
		conceptPurpose:
			"use pressure, flow, viscosity, and continuum assumptions to decide when fluid models are helpful and when they break down.",
		exampleCheck:
			"Each continuum example should include what is being averaged, the flow or pressure quantity, boundary assumptions, and a note on when particle details matter.",
		extension:
			"Include a fluid-system diagram, continuum assumption, pressure or flow evidence, model limitation, and one possible refinement.",
		labOutput:
			"The final explanation should state the continuum assumption, pressure or flow evidence, and where the simplified model stops fitting.",
		labSetup:
			"Use pipes, nozzles, ducts, blood-vessel analogies, water slides, or simplified wing models as continuum cases.",
		reflection:
			"Compare a situation where averaging the fluid works well with one where small-scale detail changes the conclusion.",
		representation:
			"The representation should show pressure, flow rate, area, viscosity, or boundary condition rather than only a fluid label.",
		toolkitFormula:
			"Use fluid equations only after the continuum assumption, boundary conditions, and relevant scale are named.",
		toolkitSetup:
			"Begin by naming the fluid, scale, flow path, boundary, and quantity being treated as continuous."
	},
	"PHY21 Thermodynamics and Engines": {
		conceptPurpose:
			"track heat, work, internal energy, reservoirs, and efficiency so energy accounting explains why real devices have limits.",
		exampleCheck:
			"Each thermodynamics example should include system boundary, heat input/output, work output/input, internal-energy change, and efficiency or loss statement.",
		extension:
			"Include an energy-flow diagram, useful-output definition, efficiency estimate, irreversibility note, and one practical limitation.",
		labOutput:
			"The final explanation should state the energy accounting, useful output, rejected energy, and one reason perfect efficiency is impossible.",
		labSetup:
			"Use engines, refrigerators, heat pumps, power plants, or human-body energy flows as accounting cases.",
		reflection:
			"Compare energy conservation with useful energy conversion, then explain why the two are not the same design goal.",
		representation:
			"The representation should show heat, work, internal energy, reservoirs, and useful versus rejected energy.",
		toolkitFormula:
			"Use thermodynamic equations only after sign convention, system boundary, and reservoirs are explicit.",
		toolkitSetup:
			"Begin by defining the system, surroundings, heat transfers, work interaction, and chosen sign convention."
	},
	"PHY22 Electromagnetic Applications and Signals": {
		conceptPurpose:
			"connect physical quantities to electrical signals, calibration, filtering, and noise so sensors are treated as measurement systems.",
		exampleCheck:
			"Each signal example should include measured quantity, sensor response, calibration relationship, noise source, and output interpretation.",
		extension:
			"Include a sensor block diagram, calibration plan, noise or filter evidence, application claim, and one limitation.",
		labOutput:
			"The final explanation should state the physical input, electrical output, calibration evidence, and one signal-processing tradeoff.",
		labSetup:
			"Use microphones, speakers, thermistors, accelerometers, RC-style filters, or noisy time-series graphs.",
		reflection:
			"Compare improving the sensor with filtering the data, then explain what information each approach can and cannot recover.",
		representation:
			"The representation should show input quantity, signal output, noise, calibration curve, or filter effect.",
		toolkitFormula:
			"Use signal equations only after units, calibration relationship, and sampling or bandwidth limits are named.",
		toolkitSetup:
			"Begin by naming the physical input, transducer behavior, output signal, calibration target, and noise source."
	},
	"PHY23 Relativity and Reference Frames Preview": {
		conceptPurpose:
			"use reference frames to show which measurements depend on observer motion and which relationships remain predictive.",
		exampleCheck:
			"Each reference-frame example should include observer frame, event description, classical expectation, correction or limitation, and scale check.",
		extension:
			"Include a frame diagram, classical prediction, relativistic correction idea, and one limitation such as speed range or simplified geometry.",
		labOutput:
			"The final explanation should state the frame choice, invariant or frame-dependent quantity, scale assumption, and one model limit.",
		labSetup:
			"Use passenger-car-road frames, high-speed particle examples, GPS timing, or event diagrams as frame-comparison cases.",
		reflection:
			"Compare ordinary relative velocity with a high-speed or precision-timing case, then state where classical reasoning stops being enough.",
		representation:
			"The representation should show observer frame, event order or timing, velocity comparison, and scale of the effect.",
		toolkitFormula:
			"Use equations only after frame choice and scale make the correction meaningful.",
		toolkitSetup:
			"Begin by naming the observers, events, relative motion, measured quantity, and expected classical answer."
	},
	"PHY24 Independent Physics Research Portfolio": {
		conceptPurpose:
			"turn a broad interest into a defensible physics question with sources, model choice, graph evidence, limits, and revision.",
		exampleCheck:
			"Each research example should include question scope, source quality, chosen model, graph or diagram evidence, and limitation.",
		extension:
			"Include research question, source evaluation, model, graph evidence, conclusion, limitation, and a revision path.",
		labOutput:
			"The final explanation should state the question, source evidence, model fit, conclusion, and the strongest remaining uncertainty.",
		labSetup:
			"Use a topic from sports, rockets, music, climate, medicine, robotics, or electronics translated into a focused physics question.",
		reflection:
			"Compare the original broad interest with the final research question, then explain what made the scope defensible.",
		representation:
			"The representation should show the evidence chain from source to model to graph or diagram to conclusion.",
		toolkitFormula:
			"Use calculations only when they answer the research question and are supported by source quality and limitations.",
		toolkitSetup:
			"Begin by narrowing the topic, naming the physical model, evaluating sources, and choosing evidence that can support a claim."
	}
};

const physicsContentReplacements: Array<
	[search: string, replaceWith: (moduleTitle: string) => string]
> = [
	[
		"The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list.",
		moduleTitle => topicContext(moduleTitle).conceptPurpose
	],
	[
		"Build the model by first naming the system, quantities, assumptions, and expected direction of change.",
		moduleTitle => topicContext(moduleTitle).toolkitSetup
	],
	[
		"Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly.",
		moduleTitle => topicContext(moduleTitle).toolkitFormula
	],
	[
		"Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result.",
		moduleTitle => topicContext(moduleTitle).exampleCheck
	],
	[
		"The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown.",
		moduleTitle => topicContext(moduleTitle).representation
	],
	[
		"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case.",
		moduleTitle => topicContext(moduleTitle).labSetup
	],
	[
		"The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption.",
		moduleTitle => topicContext(moduleTitle).labOutput
	],
	[
		"State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger.",
		moduleTitle => topicContext(moduleTitle).reflection
	],
	[
		"Check whether the core quantities, system boundary, and model assumption are identified before calculations begin.",
		moduleTitle =>
			`For ${moduleTitle}, check whether the core quantities, system boundary, and model assumption are identified before calculations begin.`
	],
	[
		"A strong checkpoint can explain why the chosen model fits this situation and where it would stop fitting.",
		moduleTitle =>
			`A strong ${moduleTitle} checkpoint can explain why the chosen model fits this situation and where it would stop fitting.`
	],
	[
		"Common pitfalls include formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system.",
		moduleTitle =>
			`Common ${moduleTitle} pitfalls include formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system.`
	],
	[
		"Watch for formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system.",
		moduleTitle =>
			`Watch for ${moduleTitle} formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system.`
	],
	[
		"The correction should replace the shortcut with a specific introductory physics model.",
		moduleTitle =>
			`The ${moduleTitle} correction should replace the shortcut with a specific introductory physics model.`
	],
	[
		"The correction should replace the shortcut with a specific advanced physics model.",
		moduleTitle =>
			`The ${moduleTitle} correction should replace the shortcut with a specific advanced physics model.`
	],
	[
		"Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note.",
		moduleTitle => topicContext(moduleTitle).extension
	]
];

const diagnosticCheckpointOverrides: Record<string, string> = {
	"PHY8 Momentum, Impulse, and Collisions":
		"Readiness check: define the system boundary, choose a positive direction, identify any external impulse, and connect force-time area to change in momentum. A strong response distinguishes momentum conservation from kinetic-energy conservation.",
	"PHY9 Rotational Motion and Torque Basics":
		"Readiness check: identify the pivot, lever arm, torque direction, and net-torque condition before calculating. A strong response distinguishes force magnitude from turning effect.",
	"PHY10 Fluids, Pressure, and Buoyancy":
		"Readiness check: connect pressure, area, density, displaced volume, and buoyant force in one scenario. A strong response explains floating or sinking with displaced fluid rather than only with object weight.",
	"PHY11 Heat, Temperature, and Thermal Energy":
		"Readiness check: distinguish temperature, heat transfer, thermal energy, specific heat, and phase-change plateaus. A strong response names the dominant transfer pathway and the quantity that is actually changing.",
	"PHY12 Optics, Mirrors, Lenses, and Images":
		"Readiness check: trace at least two rays, identify whether the image is real or virtual, and explain how focal length affects image location. A strong response treats ray diagrams as evidence, not decoration.",
	"PHY13 Magnetism and Electromagnetic Induction":
		"Readiness check: relate current direction, field direction, coils, and energy conversion in one device. A strong response explains why induction requires changing magnetic flux.",
	"PHY14 Simple Harmonic Motion and Resonance":
		"Readiness check: identify equilibrium, restoring force, amplitude, period, frequency, damping, and resonance in one oscillating system. A strong response distinguishes natural frequency from any forced vibration.",
	"PHY15 Astronomy, Gravity, and Orbits":
		"Readiness check: explain orbit as continuous free fall with gravity still acting. A strong response separates speed, velocity direction, frame of reference, and scale.",
	"PHY16 Modern Physics and Model Limits":
		"Readiness check: name the classical model, the evidence that strains it, and the refined idea needed to explain the observation. A strong response treats model limits as domain boundaries, not as total failure.",
	"PHY17 Engineering Design and Physics Portfolio":
		"Readiness check: connect claim, evidence, model, uncertainty, and revision in one portfolio artifact. A strong response explains how the evidence changed or constrained the final design.",
	"PHY17 Numerical Modeling and Simulation Checks":
		"Readiness check: state the update rule, step size, initial conditions, and comparison baseline for a simulation. A strong response separates real physical behavior from numerical artifact.",
	"PHY18 Experimental Uncertainty and Curve Fitting":
		"Readiness check: distinguish random scatter, systematic bias, residuals, slope meaning, and fit quality. A strong response explains why a model can be useful without passing exactly through every point.",
	"PHY19 Coupled Systems and Constraints":
		"Readiness check: draw separate free-body diagrams, state shared-motion constraints, and identify when tension or acceleration is assumed equal. A strong response explains which objects share which constraint and why.",
	"PHY20 Fluids and Continuum Models":
		"Readiness check: name the continuum assumption, relevant pressure or flow quantity, and model limit in a fluid scenario. A strong response explains when a particle-level detail can be ignored and when it cannot.",
	"PHY21 Thermodynamics and Engines":
		"Readiness check: track heat, work, internal energy, reservoirs, and efficiency using one sign convention. A strong response explains why real engines cannot convert all input heat into useful work.",
	"PHY22 Electromagnetic Applications and Signals":
		"Readiness check: identify the physical quantity being sensed, the electrical signal representing it, the calibration step, and one source of noise. A strong response explains what a filter changes and what it cannot recover.",
	"PHY23 Relativity and Reference Frames Preview":
		"Readiness check: separate frame-dependent measurements from invariant relationships in a low-stakes relativity scenario. A strong response explains why classical intuition remains useful only inside its speed and scale limits.",
	"PHY24 Independent Physics Research Portfolio":
		"Readiness check: define the research question, source quality, chosen model, graph evidence, limitation, and revision target. A strong response makes the scope narrow enough to defend with evidence."
};

const misconceptionWatchlistOverrides: Record<string, string> = {
	"PHY8 Momentum, Impulse, and Collisions":
		"Common pitfalls include treating momentum as the same as force, assuming every collision conserves kinetic energy, and ignoring external forces when deciding whether momentum is conserved.",
	"PHY9 Rotational Motion and Torque Basics":
		"Common pitfalls include treating force magnitude as the only thing that matters, forgetting the perpendicular lever arm, and treating clockwise or counterclockwise signs as physical truths instead of conventions.",
	"PHY10 Fluids, Pressure, and Buoyancy":
		"Common pitfalls include saying an object floats only because it is light, treating pressure as only downward, and confusing total mass with density or displaced volume.",
	"PHY11 Heat, Temperature, and Thermal Energy":
		"Common pitfalls include using heat and temperature interchangeably, saying cold flows from one object to another, and expecting temperature to change during every phase-change interval.",
	"PHY12 Optics, Mirrors, Lenses, and Images":
		"Common pitfalls include assuming every image can be projected on a screen, treating lenses as if they use up light, and drawing rays without connecting them to image evidence.",
	"PHY13 Magnetism and Electromagnetic Induction":
		"Common pitfalls include treating magnetism as only attraction, assuming current is consumed by a coil, and expecting induction without a changing magnetic field or changing loop area.",
	"PHY14 Simple Harmonic Motion and Resonance":
		"Common pitfalls include assuming amplitude always changes period, treating resonance as any vibration, and interpreting equilibrium as a place where motion is impossible.",
	"PHY15 Astronomy, Gravity, and Orbits":
		"Common pitfalls include claiming astronauts are weightless because there is no gravity, adding a forward force to keep planets moving, and treating space as a region with no interactions.",
	"PHY16 Modern Physics and Model Limits":
		"Common pitfalls include using quantum as a synonym for anything possible, picturing photons only as tiny classical balls, and thinking a model limit makes the whole earlier model useless.",
	"PHY17 Engineering Design and Physics Portfolio":
		"Common pitfalls include letting polish hide weak evidence, adding equations that do not support the claim, and treating uncertainty or limitations as weaknesses instead of part of the argument.",
	"PHY17 Numerical Modeling and Simulation Checks":
		"Common pitfalls include treating simulation output as automatically true, assuming a smaller step size fixes every issue without comparison, and mistaking numerical artifacts for physical effects.",
	"PHY18 Experimental Uncertainty and Curve Fitting":
		"Common pitfalls include forcing a best-fit line through every point, treating extra decimal places as better evidence, and deleting outliers without a defensible reason.",
	"PHY19 Coupled Systems and Constraints":
		"Common pitfalls include assuming every connected object has the same tension, using one free-body diagram for both a whole system and its parts, and skipping the constraint equation.",
	"PHY20 Fluids and Continuum Models":
		"Common pitfalls include applying Bernoulli-style reasoning to every fluid problem, treating pressure as only downward, and forgetting that continuum models break down at very small scales.",
	"PHY21 Thermodynamics and Engines":
		"Common pitfalls include treating heat as a substance contained inside an object, expecting 100 percent efficient engines, and failing to distinguish heat transfer from work.",
	"PHY22 Electromagnetic Applications and Signals":
		"Common pitfalls include treating a sensor reading as the true value without calibration, assuming filters can remove noise without tradeoffs, and ignoring bandwidth or sampling limits.",
	"PHY23 Relativity and Reference Frames Preview":
		"Common pitfalls include treating relativity as mere perception, expecting noticeable relativistic effects at ordinary speeds, and assuming reference-frame dependence means there are no objective predictions.",
	"PHY24 Independent Physics Research Portfolio":
		"Common pitfalls include substituting a broad topic for a focused question, using citations instead of reasoning, and treating limitations as something to hide rather than as evidence of careful scope."
};

function topicContext(moduleTitle: string) {
	return physicsTopicContexts[moduleTitle] ?? defaultPhysicsTopicContext;
}

function applyPhysicsSupplementOverrides(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of module.supplementalProjects) {
			if (item.title === "Diagnostic Checkpoint") {
				item.content =
					diagnosticCheckpointOverrides[module.title] ?? item.content;
			}

			if (item.title === "Misconception Watchlist") {
				item.content =
					misconceptionWatchlistOverrides[module.title] ??
					item.content;
			}
		}
	}
}

function contextualizePhysicsText(content: string, moduleTitle: string) {
	let updated = content;

	for (const [search, replaceWith] of physicsContentReplacements) {
		updated = updated.replaceAll(search, replaceWith(moduleTitle));
	}

	return updated;
}

export function contextualizePhysicsCourse(course: RawCourse): RawCourse {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.content = contextualizePhysicsText(item.content, module.title);
		}
	}

	applyPhysicsSupplementOverrides(course);

	return course;
}
