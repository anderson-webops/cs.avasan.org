import type { RawCourse } from "./types";

const physicsContentReplacements: Array<
	[search: string, replaceWith: (moduleTitle: string) => string]
> = [
	[
		"The goal is to connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list.",
		moduleTitle =>
			`In ${moduleTitle}, connect vocabulary, diagrams, calculations, and plain-language reasoning so the topic works as a usable physics model rather than a memorized list.`
	],
	[
		"Build the model by first naming the system, quantities, assumptions, and expected direction of change.",
		moduleTitle =>
			`For ${moduleTitle}, first name the system, quantities, assumptions, and expected direction of change.`
	],
	[
		"Then use formulas only after the physical relationship is clear, with units and limitations stated explicitly.",
		moduleTitle =>
			`Use ${moduleTitle} formulas only after the physical relationship is clear, with units and limitations stated explicitly.`
	],
	[
		"Each example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result.",
		moduleTitle =>
			`Each ${moduleTitle} example should include a diagram or table, a prediction before calculation, the calculation or qualitative model, and a reasonableness check after the result.`
	],
	[
		"The representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown.",
		moduleTitle =>
			`The ${moduleTitle} representation should make a physical relationship visible, such as a slope, area, trend, conservation pattern, equilibrium condition, or model breakdown.`
	],
	[
		"Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case.",
		moduleTitle =>
			`For ${moduleTitle}, use a safe remote-friendly simulation, provided dataset, video observation, or paper design case.`
	],
	[
		"The final explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption.",
		moduleTitle =>
			`The final ${moduleTitle} explanation should state the claim, evidence, model used, and one uncertainty or simplifying assumption.`
	],
	[
		"State what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger.",
		moduleTitle =>
			`For ${moduleTitle}, state what stays the same, what changes, which assumption is most fragile, and what evidence would make the conclusion stronger.`
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
		moduleTitle =>
			`For ${moduleTitle}, include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note.`
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
