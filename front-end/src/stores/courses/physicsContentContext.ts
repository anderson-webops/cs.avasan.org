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

	return course;
}
