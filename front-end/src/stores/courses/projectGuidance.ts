export interface ProjectGuidanceOptions {
	courseFamily: string;
	moduleTitle: string;
	itemTitle?: string;
	projectKind: "core" | "extension";
	hasReference: boolean;
}

function projectArtifact(kind: ProjectGuidanceOptions["projectKind"]) {
	return kind === "core" ? "implementation checkpoint" : "applied challenge";
}

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

function variantIndex(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"],
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|${kind}`;
	return stableVariantIndex(seed, count);
}

function referenceVariantIndex(
	courseFamily: string,
	moduleTitle: string,
	count: number
) {
	const seed = `${courseFamily}|${moduleTitle}|reference`;
	return stableVariantIndex(seed, count);
}

function guidanceSubject(courseFamily: string, moduleTitle: string) {
	return `${courseFamily} ${moduleTitle}`;
}

function supplementalPurposeLabel(number: string) {
	const labels: Record<string, string> = {
		"2": "Transfer Practice",
		"3": "Extension Practice",
		"4": "Challenge Practice"
	};

	return labels[number] ?? `Practice Variant ${number}`;
}

function supplementalPurposeLabelReplacement(_match: string, number: string) {
	return supplementalPurposeLabel(number);
}

function escapeStringForRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanupReferenceNamePattern() {
	return [
		"program",
		"analysis",
		"checkpoint",
		"practice set",
		"response",
		"project",
		"activity",
		"exercise",
		"implementation",
		"build",
		"task",
		"Java work",
		"Java implementation",
		"class exercise",
		"code checkpoint",
		"object-design task",
		"practice build",
		"type-model task",
		"method-contract exercise",
		"API checkpoint",
		"object-state build",
		"collection exercise",
		"Java design task",
		"systems artifact",
		"command-line build",
		"runtime check",
		"diagnostic run",
		"low-level implementation",
		"lab",
		"solution",
		"page",
		"feature",
		"app path"
	].join("|");
}

function capitalizeSentence(value: string) {
	return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function guidanceReference(courseFamily: string, moduleTitle: string) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) return "the solution";
	if (family.includes("web") || family.includes("javascript"))
		return "the feature";
	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return "the analysis";
	}
	if (family.includes("python")) return "the program";
	if (family.includes("security") || family.includes("network"))
		return "the lab";
	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		const references = [
			"the program",
			"the systems artifact",
			"the command-line build",
			"the runtime check",
			"the diagnostic run",
			"the low-level implementation"
		];

		return references[
			referenceVariantIndex(courseFamily, moduleTitle, references.length)
		];
	}
	if (family.includes("swift")) return "the app path";
	if (family.includes("java")) {
		const references = [
			"the Java implementation",
			"the class exercise",
			"the project",
			"the code checkpoint",
			"the object-design task",
			"the practice build",
			"the type-model task",
			"the method-contract exercise",
			"the API checkpoint",
			"the object-state build",
			"the collection exercise",
			"the Java design task"
		];

		return references[
			referenceVariantIndex(courseFamily, moduleTitle, references.length)
		];
	}

	return "the project";
}

function scopedGuidanceReference(reference: string, moduleTitle: string) {
	const cleanTitle = moduleTitle.trim();
	if (!cleanTitle) return reference;

	const bareReference = reference.replace(/^the\s+/i, "");
	const normalizedTitle = cleanTitle.toLowerCase();
	const normalizedReference = bareReference.toLowerCase();
	if (
		normalizedTitle === normalizedReference ||
		normalizedTitle.endsWith(` ${normalizedReference}`) ||
		normalizedTitle.includes(`${normalizedReference}:`)
	) {
		return reference;
	}

	return `the ${cleanTitle} ${bareReference}`;
}

function compactGuidanceBody(
	courseFamily: string,
	moduleTitle: string,
	body: string
) {
	const escapedTitle = escapeStringForRegExp(moduleTitle);
	const reference = guidanceReference(courseFamily, moduleTitle);
	const scopedReference = scopedGuidanceReference(reference, moduleTitle);
	const capitalizedScopedReference = capitalizeSentence(scopedReference);
	const bareScopedReference = scopedReference.replace(/^the\s+/i, "");
	const capitalizedReference = capitalizeSentence(reference);
	const bareReference = reference.replace(/^the\s+/i, "");
	const escapedCourseFamily = escapeStringForRegExp(courseFamily);
	const escapedReference = escapeStringForRegExp(reference);
	const escapedBareReference = escapeStringForRegExp(bareReference);
	const escapedScopedReference = escapeStringForRegExp(scopedReference);
	const escapedBareScopedReference =
		escapeStringForRegExp(bareScopedReference);
	const escapedCapitalizedReference =
		escapeStringForRegExp(capitalizedReference);

	const cleanupReferenceNames = cleanupReferenceNamePattern();

	return body
		.replace(
			/\bSupplemental Practice ([2-9])\b/g,
			supplementalPurposeLabelReplacement
		)
		.replace(
			/\bSupplemental ([2-9])\b/g,
			supplementalPurposeLabelReplacement
		)
		.replace(new RegExp(`\\bFor ${escapedTitle}, `, "g"), "")
		.replace(
			new RegExp(`\\bUse ${escapedTitle} to\\b`, "g"),
			`Use ${scopedReference} to`
		)
		.replace(
			new RegExp(`\\bKeep ${escapedTitle}\\b`, "g"),
			`Keep ${scopedReference}`
		)
		.replace(
			new RegExp(`\\bConnect ${escapedTitle}\\b`, "g"),
			`Connect ${scopedReference}`
		)
		.replace(
			new RegExp(`\\bBuild ${escapedTitle}\\b`, "g"),
			`Build ${scopedReference}`
		)
		.replace(
			new RegExp(`\\bAfter ${escapedTitle}\\b`, "g"),
			`After ${scopedReference}`
		)
		.replace(
			new RegExp(`\\bAfter the ${escapedTitle}\\b`, "g"),
			`After ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bThe ${escapedTitle} (review|summary|note|closing note)\\b`,
				"g"
			),
			`The ${bareScopedReference} $1`
		)
		.replace(
			new RegExp(
				`\\bThe final ${escapedTitle} (review|summary|note)\\b`,
				"g"
			),
			`The final ${bareScopedReference} $1`
		)
		.replace(
			new RegExp(
				`\\bThe closing ${escapedTitle} (review|summary|note)\\b`,
				"g"
			),
			`The closing ${bareScopedReference} $1`
		)
		.replace(
			new RegExp(`\\bCompare ${escapedTitle}\\b`, "g"),
			`Compare ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bThe ${escapedTitle} (page|app|program|result|lab|submitted program|artifact|feature|pipeline|checked cases)\\b`,
				"g"
			),
			"The $1"
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedTitle} (page|app|program|result|lab|artifact|feature|pipeline|local lab|runtime evidence)\\b`,
				"g"
			),
			"the $1"
		)
		.replace(
			new RegExp(
				`\\bA normal ${escapedTitle} (interaction|case|input)\\b`,
				"g"
			),
			"A normal $1"
		)
		.replace(
			new RegExp(`\\bA tiny hand-traced ${escapedTitle} case\\b`, "g"),
			"A tiny hand-traced case"
		)
		.replace(
			new RegExp(`\\bA typical ${escapedTitle} (path|input)\\b`, "g"),
			"A typical $1"
		)
		.replace(
			new RegExp(`\\bAt least one ${escapedTitle} normal path\\b`, "g"),
			"At least one normal path"
		)
		.replace(
			new RegExp(
				`\\bone ${escapedTitle} (visible behavior|normal case|diagnostic observation)\\b`,
				"g"
			),
			"one $1"
		)
		.replace(
			new RegExp(
				`\\b${escapedTitle} (ordinary behavior|normal traffic|samples|findings)\\b`,
				"g"
			),
			(_match, phrase: string) => capitalizeSentence(phrase)
		)
		.replace(
			new RegExp(
				`\\b${escapedTitle} (compiles|has|demonstrates|can|builds|includes)\\b`,
				"g"
			),
			`${capitalizedScopedReference} $1`
		)
		.replace(new RegExp(escapedTitle, "g"), scopedReference)
		.replace(
			/\b(After|after|Before|before|When|when|If|if|While|while|Once|once|Until|until|With|with|For|for|From|from|Against|against) The (program|project|artifact|app|lab|result|feature|pipeline)\b/g,
			(_match: string, lead: string, item: string) =>
				`${lead} the ${item}`
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedReference}\\b`,
				"gi"
			),
			reference
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedCapitalizedReference}\\b`,
				"g"
			),
			capitalizedReference
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedBareReference}\\b`,
				"gi"
			),
			reference
		)
		.replace(new RegExp(`\\bthe ${escapedReference}\\b`, "g"), reference)
		.replace(
			new RegExp(`\\bUse ${escapedReference} reference\\b`, "g"),
			"Use the reference"
		)
		.replace(
			new RegExp(
				`\\bchecked for ${escapedReference} where relevant\\b`,
				"g"
			),
			"checked where relevant"
		)
		.replace(
			new RegExp(`\\bfinal ${escapedReference} note\\b`, "g"),
			"final note"
		)
		.replace(
			new RegExp(`\\bFinal ${escapedReference} note\\b`, "g"),
			"Final note"
		)
		.replace(
			new RegExp(`\\bclosing ${escapedReference} note\\b`, "g"),
			"closing note"
		)
		.replace(
			new RegExp(`\\bClosing ${escapedReference} note\\b`, "g"),
			"Closing note"
		)
		.replace(
			new RegExp(
				`\\bAfter ${escapedReference} ${escapedBareReference}\\b`,
				"g"
			),
			`After ${reference}`
		)
		.replace(
			new RegExp(`\\bAfter ${escapedCapitalizedReference}\\b`, "g"),
			`After ${reference}`
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest compiling ${escapedReference} version first\\b`,
				"g"
			),
			`Build the smallest version of ${reference} that compiles first`
		)
		.replace(/\blocal the program version\b/g, "local version")
		.replace(/\blocal the project version\b/g, "local version")
		.replace(
			/\b(program|analysis|project|lab|feature|page|solution|artifact|app|pipeline) \1\b/gi,
			"$1"
		)
		.replace(/\b(the final|The final|the closing|The closing) the\b/g, "$1")
		.replace(/\b- the\b/g, "- The")
		.replace(
			new RegExp(`\\bAfter ${escapedReference} page behavior\\b`, "g"),
			"After the page behavior"
		)
		.replace(
			new RegExp(
				`\\bone the (${cleanupReferenceNames}) (example|case|input|path|run|trace|observation)\\b`,
				"g"
			),
			"one $2 for the $1"
		)
		.replace(
			new RegExp(`\\bAfter ${escapedReference} local lab works\\b`, "g"),
			"After the local lab works"
		)
		.replace(
			new RegExp(`\\bAfter ${escapedReference} simulator path\\b`, "g"),
			"After the simulator path"
		)
		.replace(
			new RegExp(`(^|\\n)- the (${cleanupReferenceNames})\\b`, "g"),
			(_match: string, prefix: string, item: string) =>
				`${prefix}- The ${item}`
		)
		.replace(
			new RegExp(
				`(^|\\n)- the (${cleanupReferenceNames}) (explanation|verification|summary|review|note|result|work)\\b`,
				"g"
			),
			(_match: string, prefix: string, item: string, noun: string) =>
				`${prefix}- The ${item} ${noun}`
		)
		.replace(
			new RegExp(
				`\\bfinal the (${cleanupReferenceNames}) (note|explanation|response|answer|work|review)\\b`,
				"g"
			),
			"final $1 $2"
		)
		.replace(
			new RegExp(
				`\\bFinal the (${cleanupReferenceNames}) (note|explanation|response|answer|work|review)\\b`,
				"g"
			),
			"Final $1 $2"
		)
		.replace(
			new RegExp(
				`\\bclosing the (${cleanupReferenceNames}) (note|explanation|response|answer|work|review)\\b`,
				"g"
			),
			"closing $1 $2"
		)
		.replace(
			new RegExp(
				`\\bClosing the (${cleanupReferenceNames}) (note|explanation|response|answer|work|review)\\b`,
				"g"
			),
			"Closing $1 $2"
		)
		.replace(
			new RegExp(
				`\\beach the (${cleanupReferenceNames}) Java type\\b`,
				"g"
			),
			"each Java type in the $1"
		)
		.replace(
			new RegExp(
				`\\bwhich the (${cleanupReferenceNames}) (comparisons|swaps|keys|priority values)\\b`,
				"g"
			),
			"which $1 $2"
		)
		.replace(
			new RegExp(
				`\\bwhich ${escapedReference} (branch|loop|helper|collection|file step|comparison|comparisons|swap|swaps|operation|rule|path|step)\\b`,
				"g"
			),
			"which $1"
		)
		.replace(
			new RegExp(
				`\\bwhich ${escapedBareReference} (branch|loop|helper|collection|file step|comparison|comparisons|swap|swaps|operation|rule|path|step)\\b`,
				"g"
			),
			"which $1"
		)
		.replace(
			new RegExp(`\\bwhich ${escapedReference} values\\b`, "g"),
			"which values"
		)
		.replace(
			new RegExp(`\\bwhich ${escapedBareReference} values\\b`, "g"),
			"which values"
		)
		.replace(
			new RegExp(
				`\\b(a compact|one|every|a|an) the (${cleanupReferenceNames}) (sample|Java type|comparisons|swaps|keys|priority values)\\b`,
				"g"
			),
			"$1 $2 $3"
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest reproducible ${escapedReference} run first\\b`,
				"g"
			),
			"Build the smallest reproducible run first"
		)
		.replace(
			new RegExp(
				`\\bBuild the smallest reproducible ${escapedBareReference} run first\\b`,
				"g"
			),
			"Build the smallest reproducible run first"
		)
		.replace(
			new RegExp(`\\bImplement one ${escapedReference} `, "g"),
			"Implement one "
		)
		.replace(
			new RegExp(
				`\\b(one|each|every|a|an) ${escapedReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path)\\b`,
				"g"
			),
			"$1 $2"
		)
		.replace(
			new RegExp(
				`\\b(one|each|every|a|an) ${escapedBareReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path)\\b`,
				"g"
			),
			"$1 $2"
		)
		.replace(
			new RegExp(
				`\\bVerify ${capitalizeSentence(escapedReference)} (ordinary behavior|normal behavior|samples|findings|runtime evidence|page behavior|simulator path)\\b`,
				"g"
			),
			"Verify $1"
		)
		.replace(
			new RegExp(
				`\\bVerify ${capitalizeSentence(escapedBareReference)} (ordinary behavior|normal behavior|samples|findings|runtime evidence|page behavior|simulator path)\\b`,
				"g"
			),
			"Verify $1"
		)
		.replace(
			new RegExp(
				`\\bone tiny ${escapedReference} hand-built case\\b`,
				"g"
			),
			"one tiny hand-built case"
		)
		.replace(
			new RegExp(
				`\\bSolve one tiny ${escapedReference} hand-built case\\b`,
				"g"
			),
			"Solve one tiny hand-built case"
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedReference} verification note\\b`,
				"g"
			),
			`Write a verification note for ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedBareReference} verification note\\b`,
				"g"
			),
			`Write a verification note for ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedScopedReference} verification note\\b`,
				"g"
			),
			`Write a verification note for ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bWrite a ${escapedBareScopedReference} verification note\\b`,
				"g"
			),
			`Write a verification note for ${scopedReference}`
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedReference} (behavior|runtime evidence|local lab|page behavior|program|simulator path)\\b`,
				"g"
			),
			`the ${bareReference} $1`
		)
		.replace(
			new RegExp(
				`\\bthe ${escapedBareReference} (behavior|runtime evidence|local lab|page behavior|program|simulator path)\\b`,
				"g"
			),
			`the ${bareReference} $1`
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedScopedReference}\\b`,
				"gi"
			),
			scopedReference
		)
		.replace(
			new RegExp(
				`\\b${escapedCourseFamily} ${escapedBareScopedReference}\\b`,
				"gi"
			),
			scopedReference
		)
		.replace(
			new RegExp(`\\bthe ${escapedScopedReference}\\b`, "g"),
			scopedReference
		)
		.replace(new RegExp(`\\b(${cleanupReferenceNames}) \\1\\b`, "gi"), "$1")
		.replace(/\b([A-Z][A-Z-]{3,})\s+\1\b/gi, "$1")
		.replace(/\b(the final|The final|the closing|The closing) the\b/g, "$1")
		.replace(
			new RegExp(
				`\\b(final|Final|closing|Closing) ${escapedScopedReference} (note|explanation|response|answer|work|review)\\b`,
				"g"
			),
			(_match: string, lead: string, noun: string) =>
				`${lead} ${noun} for ${scopedReference}`
		)
		.replace(/(^|\s)- the\b/g, "$1- The")
		.replace(
			/\b(a|an) the ([A-Z][^.!?\n]{1,120}?)( verification note| review| summary| note)\b/g,
			(_match: string, article: string, subject: string, noun: string) =>
				`${article} ${noun.trim()} for the ${subject}`
		)
		.replace(
			/\*\*Focus:\*\* ([a-z])/g,
			(_, first: string) => `**Focus:** ${first.toUpperCase()}`
		)
		.replace(
			/(^|\n)- ([a-z])/g,
			(_match: string, prefix: string, first: string) =>
				`${prefix}- ${first.toUpperCase()}`
		)
		.replace(
			/(^|\n)(\d+\. )([a-z])/g,
			(_match, prefix: string, marker: string, first: string) =>
				`${prefix}${marker}${first.toUpperCase()}`
		);
}

function normalizeGeneratedGuidanceText(
	courseFamily: string,
	guidanceText: string
) {
	const cleanupReferenceNames = cleanupReferenceNamePattern();
	const escapedCourseFamily = escapeStringForRegExp(courseFamily);

	return guidanceText
		.replace(new RegExp(`\\b(${cleanupReferenceNames}) \\1\\b`, "gi"), "$1")
		.replace(/\b([A-Z][A-Z-]{3,})\s+\1\b/gi, "$1")
		.replace(/\b(the final|The final|the closing|The closing) the\b/g, "$1")
		.replace(
			new RegExp(
				`\\b(final|Final|closing|Closing) the ([^\\n]{1,220}?) ` +
					`(${cleanupReferenceNames}) ` +
					"(note|explanation|response|answer|work|review|result|conclusion)\\b",
				"g"
			),
			(
				_match: string,
				lead: string,
				subject: string,
				reference: string,
				noun: string
			) => `${lead} ${noun} for the ${subject} ${reference}`
		)
		.replace(
			new RegExp(`\\b${escapedCourseFamily} the ([A-Z])`, "g"),
			"the $1"
		)
		.replace(/\bJava Level [1-3] (?:The\s+)?the ([A-Z])/g, "the $1")
		.replace(/\bThe the ([A-Z])/g, "The $1")
		.replace(/\bthe the ([A-Z])/g, "the $1")
		.replace(
			/\bWrite a the ([A-Z][^.!?\n]{1,180}?) verification note\b/g,
			"Write a verification note for the $1"
		)
		.replace(
			/\b(a|an) the ([A-Z][^.!?\n]{1,120}?)( verification note| review| summary| note)\b/g,
			(_match: string, article: string, subject: string, noun: string) =>
				`${article} ${noun.trim()} for the ${subject}`
		)
		.replace(
			new RegExp(
				`\\b(one|each|every|a|an) the ([A-Z][^.!?\\n]{1,180}?) ` +
					`(${cleanupReferenceNames}) ` +
					"(example|case|input|path|run|trace|observation|boundary|" +
					"behavior|constructor|branch|method|collection operation|" +
					"diagnostic|data-structure|resource|control-flow change|" +
					"variable|state transition|view|model|persistence path|" +
					"normal case|edge case|ordinary behavior|runtime evidence|" +
					"local lab|page behavior|simulator path)\\b",
				"g"
			),
			(
				_match: string,
				quantifier: string,
				subject: string,
				reference: string,
				noun: string
			) => `${quantifier} ${noun} for the ${subject} ${reference}`
		)
		.replace(/(^|\s)- the\b/g, "$1- The");
}

function checkInDetails(moduleTitle: string) {
	const trimmedTitle = moduleTitle.trim();
	const prefix = "Check-In #";
	if (!trimmedTitle.toLowerCase().startsWith(prefix.toLowerCase())) {
		return { isCheckIn: false, topic: "" };
	}

	let cursor = prefix.length;
	while (cursor < trimmedTitle.length && /\d/.test(trimmedTitle[cursor])) {
		cursor++;
	}

	const remainder = trimmedTitle.slice(cursor).trim();
	const topic = remainder.startsWith(":")
		? remainder.slice(1).trim()
		: remainder;

	return { isCheckIn: true, topic };
}

function compactGuidanceModuleTitle(moduleTitle: string) {
	return moduleTitle
		.replace(/\b(?:Applied|Implementation) (?:Lab|Studio):\s*/i, "")
		.replace(/:\s*(?:Core Project|Applied Challenge)$/i, "")
		.replace(/:\s*(?:Applied|Implementation) (?:Lab|Studio)$/i, "")
		.replace(/\s+(?:Applied|Implementation) (?:Lab|Studio)$/i, "")
		.trim();
}

function guidanceModuleTitle(moduleTitle: string, itemTitle?: string) {
	if (!itemTitle) return moduleTitle;

	const { isCheckIn, topic: checkInTopic } = checkInDetails(moduleTitle);
	const compactModuleTitle = compactGuidanceModuleTitle(moduleTitle);
	const compactItemTitle = compactGuidanceModuleTitle(itemTitle);

	if (
		compactItemTitle
			.toLowerCase()
			.startsWith(`${compactModuleTitle.toLowerCase()}:`)
	) {
		const itemSuffix = compactItemTitle
			.slice(compactModuleTitle.length + 1)
			.trim();
		if (/^(?:Core Project|Applied Challenge)$/i.test(itemSuffix)) {
			return compactModuleTitle;
		}
	}

	const supplementalMatch = itemTitle.match(/\bsupplemental\s+(\d+)\b/i);
	if (supplementalMatch) {
		const label = supplementalPurposeLabel(supplementalMatch[1]);
		if (checkInTopic) {
			return `${checkInTopic} ${label}`;
		}
		if (isCheckIn) {
			return `${moduleTitle.replace(/^Check-In/i, "Checkpoint")} ${label}`;
		}
		return `${compactModuleTitle} ${label}`;
	}

	const extensionMatch = itemTitle.match(/\bextension challenge\b/i);
	if (extensionMatch) {
		return `${compactModuleTitle} Extension Challenge`;
	}

	return compactModuleTitle;
}

function projectGoal(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();
	const artifact = projectArtifact(kind);
	const index = variantIndex(courseFamily, moduleTitle, kind, 4);

	if (family.includes("usaco")) {
		return [
			`**Project goal:** Solve the ${courseFamily} ${artifact} for **${moduleTitle}** with exact input/output behavior, a traceable invariant, and evidence from sample plus custom cases.`,
			`**Project goal:** Turn **${moduleTitle}** into a contest-ready ${courseFamily} ${artifact} with a proved idea, matching samples, and at least one custom edge case.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} that states the constraints, preserves an invariant, and justifies complexity.`,
			`**Project goal:** Implement **${moduleTitle}** with strict USACO input/output discipline, then verify the algorithm against samples and a hand-built boundary case.`
		][index];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a browser-visible feature with clear state, interaction, and error-handling evidence.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${courseFamily} ${artifact} that connects user input, page state, and visible output.`,
			`**Project goal:** Implement **${moduleTitle}** with a normal browser path, an invalid or empty path, and evidence from the page, console, or network flow.`,
			`**Project goal:** Produce **${moduleTitle}** as a user-facing ${courseFamily} ${artifact} with interaction, validation, and accessibility or layout evidence.`
		][index];
	}

	if (family.includes("ai/python")) {
		return [
			`**Project goal:** Complete **${moduleTitle}** as an AI/Python ${artifact} with explicit state, decision logic, visible output, and one sanity check.`,
			`**Project goal:** Build **${moduleTitle}** as an AI/Python ${artifact} that exposes the input state, rule or search step, output, and limitation.`,
			`**Project goal:** Produce **${moduleTitle}** as an AI/Python ${artifact} with inspectable intermediate behavior and a cautious interpretation.`,
			`**Project goal:** Complete **${moduleTitle}** as an AI/Python ${artifact} that can be traced from setup through result and checked against one edge case.`
		][index];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`**Project goal:** Produce the ${courseFamily} ${artifact} for **${moduleTitle}** as an evidence-backed analysis, model, or search result with a stated limitation.`,
			`**Project goal:** Complete **${moduleTitle}** as a ${artifact} for ${courseFamily} that inspects inputs, records assumptions, and verifies the output with a sanity check.`,
			`**Project goal:** Build **${moduleTitle}** around a clear question, measurable result, baseline or trace, and limitation that affects interpretation.`,
			`**Project goal:** Turn **${moduleTitle}** into a reproducible data/model checkpoint with visible intermediate evidence and a cautious conclusion.`
		][index];
	}

	if (family.includes("java")) {
		return [
			`**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** with compiling Java code, clear object boundaries, and checks for normal and edge behavior.`,
			`**Project goal:** Complete **${moduleTitle}** as a Java ${artifact} that exposes class responsibilities, public behavior, and one edge case.`,
			`**Project goal:** Build **${moduleTitle}** through short compile/run cycles, then verify the relevant object state, method contract, or collection behavior.`,
			`**Project goal:** Produce **${moduleTitle}** with a named Java type boundary, observable behavior, and evidence from a normal case plus a boundary case.`
		][index];
	}

	if (family.includes("python")) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** as a runnable Python program with readable data flow and traceable boundary cases.`,
			`**Project goal:** Complete **${moduleTitle}** as a Python ${artifact} with separated input, transformation, and output behavior.`,
			`**Project goal:** Implement **${moduleTitle}** with a hand-checkable normal case, an awkward input or boundary case, and readable helper boundaries.`,
			`**Project goal:** Produce **${moduleTitle}** as a runnable program whose data flow can be traced without guessing hidden state.`
		][index];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`**Project goal:** Complete the ${courseFamily} ${artifact} for **${moduleTitle}** inside the approved local boundary, with defensive evidence and a rollback or hardening note.`,
			`**Project goal:** Turn **${moduleTitle}** into a scoped defensive checkpoint with captured evidence, interpretation, and mitigation or rollback notes.`,
			`**Project goal:** Build **${moduleTitle}** around an owned-lab symptom, diagnostic command, observed result, and hardening or validation step.`,
			`**Project goal:** Produce **${moduleTitle}** with explicit scope, safe test evidence, and a final state that can be verified.`
		][index];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			`**Project goal:** Build the ${courseFamily} ${artifact} for **${moduleTitle}** with a reproducible command, inspectable runtime behavior, and memory or diagnostic evidence.`,
			`**Project goal:** Complete **${moduleTitle}** as a systems ${artifact} that names the command path, resource boundary, and diagnostic evidence.`,
			`**Project goal:** Implement **${moduleTitle}** in short build/run/debug cycles, then verify one normal path and one boundary or failure path.`,
			`**Project goal:** Produce **${moduleTitle}** with visible low-level evidence such as compiler output, sanitizer output, logs, traces, timing, or memory state.`
		][index];
	}

	if (family.includes("swift")) {
		return [
			`**Project goal:** Implement the ${courseFamily} ${artifact} for **${moduleTitle}** as a simulator-verified app path with visible state, navigation, or persistence behavior.`,
			`**Project goal:** Complete **${moduleTitle}** as a Swift app checkpoint with a visible screen state and one verified interaction path.`,
			`**Project goal:** Build **${moduleTitle}** with a clear state owner, simulator evidence, and one empty, error, layout, or accessibility check.`,
			`**Project goal:** Produce **${moduleTitle}** as a runnable app slice whose behavior can be demonstrated from launch through the target interaction.`
		][index];
	}

	return [
		`**Project goal:** Create the ${courseFamily} ${artifact} for **${moduleTitle}** with an observable result, a checked boundary case, and a short reasoning note.`,
		`**Project goal:** Complete **${moduleTitle}** as a ${artifact} for ${courseFamily} with a clear success condition and evidence that the result works.`,
		`**Project goal:** Build **${moduleTitle}** in small verifiable steps, then compare the expected result with the observed result.`,
		`**Project goal:** Produce **${moduleTitle}** as a focused artifact that demonstrates the module concept and one important edge case.`
	][index];
}

function familyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			`Translate ${moduleTitle} into inputs, state, invariants, and output before optimizing; add one tiny custom case and one bounds, ordering, or off-by-one case beyond the sample`,
			`Use ${moduleTitle} to practice contest discipline: restate the constraints, trace the invariant on a hand-built case, then test a sample and a custom edge case`,
			`For ${moduleTitle}, prove the idea before coding by writing a smallest-case trace, then confirm the implementation against sample output and one adversarial boundary case`,
			`Keep ${moduleTitle} grounded in the official input/output contract, the preserved invariant, the expected complexity, and at least one non-sample case that could expose a wrong assumption`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`Connect ${moduleTitle} browser behavior to state changes, event handling, DOM or canvas output, and user input; the result is inspectable in the page, not only in source code`,
			`For ${moduleTitle}, make the browser evidence visible through a user action, a state or data change, rendered output, and one failure or empty-state check`,
			`Use ${moduleTitle} to tie the code to the page: event listener, state update, DOM or canvas result, and keyboard or responsive-layout behavior are observable`,
			`Keep ${moduleTitle} grounded in the actual user flow, with source code, browser output, console or network evidence, and one edge interaction all agreeing`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`For ${moduleTitle}, connect the code to evidence: inspect the input data, describe the transformation or model behavior, and verify the result with a small sanity check before treating the output as meaningful`,
			`Use ${moduleTitle} to make the evidence path visible: name the source, expose an intermediate result, compare against a baseline or expectation, and state one limitation`,
			`Keep ${moduleTitle} grounded in data quality, transformation steps, measured output, and an interpretation that does not overclaim beyond the evidence`,
			`For ${moduleTitle}, show how the dataset or state space becomes a result by documenting the assumptions, calculation or model behavior, sanity check, and caveat`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("python")) {
		return [
			`Keep the ${moduleTitle} Python implementation readable and testable by separating input handling, data transformation, helper functions, and output; boundary cases stay small enough to trace by hand`,
			`Use ${moduleTitle} to practice Python structure: isolate the calculation, name the data shape, run one normal case, and run one boundary case without hiding logic in input prompts`,
			`For ${moduleTitle}, make the Python data flow visible from input or setup through transformation to output, with one small traceable case proving the main branch or loop`,
			`Build ${moduleTitle} as readable Python first: clear names, narrow helper functions when useful, predictable output, and a test case that catches more than syntax errors`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`Work on ${moduleTitle} only inside the provided local or owned lab boundary; the finished artifact includes defensive evidence such as logs, traces, validation results, or a short risk note`,
			`Keep ${moduleTitle} scoped to approved local systems and include concrete defensive evidence, rollback notes, or validation results in the finished artifact`,
			`Treat ${moduleTitle} as a defensive evidence exercise: name the allowed boundary, capture the relevant logs or traces, and finish with a risk or hardening note`,
			`For ${moduleTitle}, connect every security or networking claim to owned-lab evidence such as configuration, packet, log, validation, or mitigation output`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			`For ${moduleTitle}, make the system boundary explicit: inputs, memory ownership, resource lifetime, build settings, and diagnostic output are easy to inspect and reproduce`,
			`Use ${moduleTitle} to connect representation, ownership or resource lifetime, build evidence, and one diagnostic output that confirms behavior`,
			`Keep ${moduleTitle} reproducible by naming the compile or run command, the resource boundary, the expected output, and one failure or edge case`,
			`For ${moduleTitle}, show how the low-level representation or system state changes, then verify it with concrete terminal, debugger, sanitizer, or log evidence`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("swift")) {
		return [
			`Connect ${moduleTitle} to app behavior: state ownership, view updates, user interaction, and a simulator verification path are clear from the running project`,
			`For ${moduleTitle}, make the SwiftUI behavior visible through the state owner, the screen update, one user action, and one empty, error, layout, or accessibility check`,
			`Use ${moduleTitle} to separate model state from view behavior, then verify the normal interaction and one edge state in the simulator or preview data`,
			`Keep ${moduleTitle} app-focused by showing launch state, the target interaction, the UI response, and the evidence that Xcode configuration is not hiding behavior`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("scratch")) {
		return [
			`Scratch game design: define the sprites, events, variables, stage state, and visible feedback for ${moduleTitle}`,
			`Scratch game design: connect ${moduleTitle} controls, broadcasts, variables, costumes or backdrops, and reset behavior to the playable result`,
			`Scratch game design: make ${moduleTitle} traceable from player action to block sequence to visible stage change`,
			`Scratch game design: verify ${moduleTitle} through a normal play path, an awkward input or reset case, and a clear explanation of the event flow`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("pygame")) {
		return [
			`PyGame development: define the game-loop state, actors, input events, collisions, timing, assets, and visible feedback for ${moduleTitle}`,
			`PyGame development: connect ${moduleTitle} startup, event handling, updates, drawing, collision logic, and reset behavior to the playable result`,
			`PyGame development: make ${moduleTitle} traceable from player input to state update to rendered frame`,
			`PyGame development: verify ${moduleTitle} with a normal play path, a boundary interaction, and a short explanation of the loop state`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	return "Connect the implementation to the module concept through observable behavior, a clear test path, and a short explanation of the reasoning behind the final design";
}

function javaFamilyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	return [
		`Use Java syntax and object boundaries deliberately in ${moduleTitle}: method contracts, object state, collection choices, and compile-run feedback are visible in the finished artifact`,
		`Make ${moduleTitle} show how Java responsibilities are divided across classes, methods, records, interfaces, collections, or tests instead of hiding everything in one procedure`,
		`Connect ${moduleTitle} to concrete Java behavior: object construction, method calls, state changes, access boundaries, and one edge case are easy to inspect`,
		`Keep ${moduleTitle} structured enough to explain: name the owning type, the public behavior, the state or data representation, and the compile/run evidence that proves it`
	][variantIndex(courseFamily, moduleTitle, kind, 4)];
}

function systemsFamilyFocus(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	return [
		`Make ${moduleTitle} inspectable from the command line: inputs, ownership or resource boundaries, build settings, and diagnostic output are easy to reproduce`,
		`Use ${moduleTitle} to expose the system boundary directly: command, file, memory, lifetime, process, register, or runtime evidence is visible`,
		`Keep ${moduleTitle} reproducible by naming the build/run command, the relevant boundary, and the trace, log, sanitizer, debugger, or performance evidence`,
		`Treat ${moduleTitle} as a systems checkpoint: the artifact shows what was built, what resource or memory assumption matters, and how the result was verified`,
		`Use ${moduleTitle} to connect source code to runtime evidence: command line, build output, process state, memory layout, and diagnostic traces agree`,
		`Make ${moduleTitle} easy to rerun from scratch by recording setup assumptions, command sequence, expected output, and one low-level observation`,
		`Keep ${moduleTitle} focused on the boundary between program design and machine behavior, with evidence from compilation, execution, or diagnostics`,
		`Treat ${moduleTitle} as an engineering artifact: define the contract, run it from a clean command, and capture the evidence that proves the contract holds`,
		`Use ${moduleTitle} to make one ownership, resource, process, or performance assumption visible through repeatable command evidence`,
		`Frame ${moduleTitle} around the command path and the diagnostic signal that would reveal an incorrect systems assumption`,
		`Make ${moduleTitle} show both the intended behavior and the evidence source used to distinguish it from a lucky run`,
		`Keep ${moduleTitle} tied to concrete artifacts: source files, build flags, runtime input, output, and one diagnostic observation`
	][variantIndex(courseFamily, moduleTitle, kind, 12)];
}

function focusFor(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("java")) {
		return javaFamilyFocus(courseFamily, moduleTitle, kind);
	}
	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return systemsFamilyFocus(courseFamily, moduleTitle, kind);
	}

	return familyFocus(courseFamily, moduleTitle, kind);
}

function requiredWorkSteps(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			[
				`Translate ${moduleTitle} into input format, output format, constraints, and the invariant the solution must preserve.`,
				`Solve one tiny ${moduleTitle} hand-built case before coding so the algorithm has a traceable target.`,
				`Implement the ${moduleTitle} approach incrementally, checking the sample, a custom edge case, and one bounds or ordering case.`
			],
			[
				`Restate ${moduleTitle} as a contest contract: input shape, output shape, constraints, and the property preserved by the algorithm.`,
				`Trace a smallest useful ${moduleTitle} case by hand before coding so the implementation has a known target.`,
				`Run the sample, one boundary case, and one duplicate, tie, ordering, or off-by-one case before comparing with the reference.`
			],
			[
				`Identify the ${moduleTitle} variables, limits, invariant, and complexity budget before writing code.`,
				`Use one tiny ${moduleTitle} trace to validate the idea, then implement in steps that keep input/output behavior exact.`,
				`Check the official sample plus one non-sample case shaped by the hardest constraint or ordering assumption.`
			],
			[
				`Convert ${moduleTitle} into precise stdin/stdout behavior, a maintained invariant, and a target runtime before coding.`,
				`Build the solution around one hand-checkable case, then expand to the sample and one adversarial or boundary input.`,
				`Record which constraint, edge case, or ordering detail most influenced the algorithm.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			[
				"Identify the feature user interaction, state change, DOM/canvas/API output, and visible error or empty state.",
				`Implement one ${moduleTitle} visible behavior at a time, inspecting the page, console, network panel, or local server after each change.`,
				`Verify ${moduleTitle} with a normal interaction, an invalid or empty input, and one accessibility, layout, or deployment-readiness check.`
			],
			[
				`Map ${moduleTitle} from user action to state, data, rendered output, and feedback before changing code.`,
				`Build the feature in small browser-checked steps with console, network, DOM, or canvas evidence visible.`,
				`Test a clean interaction, a missing or invalid input, and one keyboard, screen-size, or deployment-readiness concern.`
			],
			[
				`Name the ${moduleTitle} event, data boundary, UI state, and expected page response before implementation.`,
				`After each change, reload the page and inspect the relevant browser evidence rather than trusting source code alone.`,
				`Exercise ordinary behavior plus one empty, failed, inaccessible, or awkward layout state.`
			],
			[
				`Define the ${moduleTitle} user experience: input path, visible response, error handling, and final screen state.`,
				`Implement the smallest visible slice first, then add validation, layout, or persistence behavior with browser checks.`,
				`Confirm the result after refresh, at another viewport width, and with one invalid or incomplete interaction.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			[
				`Inspect the ${moduleTitle} input data, state space, features, labels, or rules before deciding what result would count as evidence.`,
				`Implement the ${moduleTitle} transformation, model, search, or scoring step in small checks that expose intermediate results.`,
				`Verify ${moduleTitle} with a normal case, a boundary or failure case, and one limitation that affects how confidently the output can be interpreted.`
			],
			[
				`State the ${moduleTitle} question, input source, success signal, and assumption most likely to affect interpretation.`,
				`Expose one intermediate ${moduleTitle} table, trace, metric, baseline, or visualization before accepting the final output.`,
				`Check a hand-verifiable case, a representative case, and one case where the method could fail or mislead.`
			],
			[
				`Define the ${moduleTitle} measurement, prediction, classification, search, or comparison target before implementation begins.`,
				`Build the pipeline in inspectable stages so input quality, transformation behavior, and output evidence are visible.`,
				`Record a normal result, a sanity check, and one caveat that limits the conclusion.`
			],
			[
				`List the ${moduleTitle} data shape, model or algorithm behavior, comparison point, and interpretation boundary before coding.`,
				`Run a small trace or baseline first, then add the larger analysis or model step only after the intermediate result makes sense.`,
				`Verify the result with evidence and write one limitation before making a conclusion.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("java")) {
		const subject = guidanceSubject(courseFamily, moduleTitle);

		return [
			[
				`Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities in ${subject}.`,
				`Implement one ${subject} constructor, method, branch, or test at a time, compiling after each meaningful change.`,
				`Check ${subject} with a normal case, an edge case, and one object-state or method-dispatch case tied to the module concept.`
			],
			[
				`For ${subject}, identify which type owns the state, which method exposes behavior, and which test or console trace proves it.`,
				`Build the smallest version of ${subject} that compiles first, then add one behavior or branch at a time.`,
				`Verify ${subject} with a standard case, a boundary case, and one case involving object identity, equality, inheritance, records, or collections when relevant.`
			],
			[
				"Map the program into Java responsibilities before coding: constructor data, method parameters, return values, stored state, and any collection shape.",
				`Compile ${subject} after each meaningful signature, field, branch, or loop change so errors stay local.`,
				`Check ${subject} with one ordinary path, one awkward or invalid input path, and one state transition or method-call sequence.`
			],
			[
				`Name the public behavior for ${subject}, then decide which class, helper method, interface, record, or collection owns it.`,
				`Implement the ${subject} behavior in short compile/run cycles with a visible output, assertion, or trace after each stage.`,
				`Verify ${subject} with one normal case, one edge path, and one design boundary such as encapsulation, overriding, overloading, or collection mutation.`
			],
			[
				`Write the ${subject} object model first: type names, fields, public methods, and the evidence each method produces.`,
				`Compile after each constructor, method signature, branch, or collection change so the next error has a narrow cause.`,
				`Check ${subject} with an ordinary call, a boundary call, and one state change that proves the object is not just storing data.`
			],
			[
				`For ${subject}, separate syntax setup from design setup by naming the package, class boundary, state, and public contract.`,
				`Build a minimal runnable version, then add one Java feature at a time: access control, overload, override, interface, record, or collection behavior.`,
				`Verify ${subject} with a traceable example and one awkward case that would expose a weak method contract.`
			],
			[
				`Start ${subject} with a concrete method-call example, including parameter values, expected return or output, and any state before and after the call.`,
				`Keep compile/run cycles short enough that a type error, null risk, equality issue, or dispatch mistake points to one recent edit.`,
				`Test ${subject} with a normal path, a boundary path, and one case that checks how classes collaborate.`
			],
			[
				`Decide the public API for ${subject}, the private implementation details, and the evidence that proves the boundary works.`,
				`Implement one responsibility at a time and keep constructor setup, method behavior, and collection or inheritance logic separately testable.`,
				`Compare ${subject} against one expected scenario and one failure-shaped scenario before using the reference.`
			],
			[
				`Write ${subject} as a small Java contract: visible behavior, stored state, input values, output values, and ownership of each rule.`,
				`Add fields, constructors, methods, and tests in an order that keeps every compile error tied to a recent change.`,
				`Check one straightforward scenario, one boundary scenario, and one scenario involving object identity, equality, or mutation.`
			],
			[
				`Choose the ${subject} type structure before coding: class, record, interface, helper, collection, or inheritance relationship.`,
				`Keep each implementation slice runnable, then expand only after the current method behavior is visible.`,
				`Use the final check to show both the Java syntax rule and the design boundary being practiced.`
			],
			[
				`Describe ${subject} with an example object or call sequence before implementing the general version.`,
				`Keep one small driver example available while compiling after each state, branch, loop, or dispatch change.`,
				`Check the expected path, a boundary path, and one case that would expose a vague method contract.`
			],
			[
				`Separate ${subject} into model behavior, runner or console behavior, and any collection or inheritance behavior.`,
				`Implement the smallest observable model behavior first, then add the extra path that carries the module concept.`,
				`Confirm the result with a concrete output, assertion, or trace for a typical case and a deliberately awkward case.`
			],
			[
				`Define ${subject} through one example object state, one public call, and one expected result before writing the general solution.`,
				`Compile after each change to the public contract, then rerun the smallest example before expanding behavior.`,
				`Use the final check to identify the class, method, record, interface, or collection choice that carried the design.`
			],
			[
				`Start ${subject} by separating data representation, behavior, and driver code.`,
				`Add implementation details in slices that keep errors tied to one field, constructor, method, branch, or list operation.`,
				`Check a normal run, a boundary run, and one run that tests how Java references or objects behave.`
			],
			[
				`Write the ${subject} API expectation first: what can be called, what changes state, and what gets returned or printed.`,
				`Keep object creation, method calls, and collection changes independently inspectable while the program compiles.`,
				`Compare the finished behavior with one passing example and one example designed to reveal a weak contract.`
			],
			[
				`Choose a narrow responsibility for each ${subject} Java type before adding optional behavior.`,
				`Build the first runnable path around one constructor or method, then add edge behavior only after the main path is verified.`,
				`Finish with evidence that names the relevant Java concept and the code boundary where it appears.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 16)];
	}

	if (family.includes("python")) {
		return [
			[
				`Name the ${moduleTitle} input, transformation, helper function boundary, data structure, and expected output before coding.`,
				`Implement ${moduleTitle} in small runnable pieces, keeping input handling, transformation, and output easy to inspect.`,
				`Check ${moduleTitle} with a normal case, a boundary case, and one unexpected or awkward input that can be traced by hand.`
			],
			[
				`Sketch the ${moduleTitle} data flow from user input or file data through variables, loops, helpers, and printed or saved output.`,
				`Build ${moduleTitle} one behavior at a time and run the program after each meaningful parsing, loop, or helper change.`,
				`Test a typical input, a smallest useful input, and one messy input such as extra spaces, unusual casing, or duplicate data.`
			],
			[
				`Define the ${moduleTitle} starting data, intermediate state, loop or function responsibility, and final result before writing code.`,
				`Keep ${moduleTitle} runnable while adding logic so each error points to one recent branch, loop, helper, or collection change.`,
				`Compare the output for one ordinary case, one boundary case, and one case that is rejected, ignored safely, or handled with a clear fallback.`
			],
			[
				`Turn ${moduleTitle} into a Python plan: inputs, stored values, functions, collections, control flow, and visible evidence.`,
				`Implement the smallest correct slice first, then add validation, iteration, file handling, or formatting only after it runs.`,
				`Trace ${moduleTitle} by hand for one compact case, then confirm the program with a normal case and an awkward case.`
			],
			[
				`Identify which ${moduleTitle} values are collected, transformed, stored, searched, counted, or printed before implementation begins.`,
				`Add one helper, loop, conditional, or data-structure operation at a time and rerun ${moduleTitle} with labeled output.`,
				`Use a clean input, an empty or minimal input, and a noisy input to check whether the data flow stays understandable.`
			],
			[
				`Write the ${moduleTitle} expected behavior as a small input/output example before deciding on loops, functions, or collections.`,
				`Keep ${moduleTitle} logic separated into input handling, core computation, and output formatting where the prompt allows it.`,
				`Verify the result with one hand-checkable example, one boundary example, and one example that could expose hidden state.`
			],
			[
				`List the ${moduleTitle} assumptions about input shape, types, ordering, duplicates, missing data, and output format.`,
				`Implement ${moduleTitle} in short runs that expose the current variables, collection contents, or helper return values.`,
				`Check the program with representative data, smallest useful data, and one malformed or surprising case.`
			],
			[
				`Before coding ${moduleTitle}, name the main function or loop, the data it receives, the data it changes, and the visible result it produces.`,
				`Build ${moduleTitle} from a tiny traceable case toward the full prompt, rerunning after each control-flow or data-structure change.`,
				`Finish by testing one ordinary case, one edge case, and one case chosen because it might break the first design.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			[
				`State the ${moduleTitle} local lab boundary, protected asset, unsafe assumption, and evidence that would prove the issue or fix.`,
				`Run or modify the ${moduleTitle} fixture in small steps while capturing logs, traces, requests, responses, or configuration changes.`,
				`Verify ${moduleTitle} normal behavior, failure or attack-shaped behavior, and one remediation, detection, or hardening result.`
			],
			[
				`Define the approved ${moduleTitle} target, allowed traffic or inputs, expected safe behavior, and failure mode before running the lab.`,
				`Capture one concrete ${moduleTitle} evidence source such as a log, packet, request, response, rule, or configuration diff at each major step.`,
				`Finish with proof of normal operation plus one defensive validation, rollback, or hardening check.`
			],
			[
				`Identify the ${moduleTitle} trust boundary, asset, threat or fault assumption, and evidence needed to support the finding.`,
				`Work through the lab in reversible steps while recording command output, traces, logs, or service responses.`,
				`Compare expected behavior, failure-shaped behavior, and the result after mitigation or configuration change.`
			],
			[
				`Scope ${moduleTitle} to owned fixtures or local systems, then name the risk, control, and validation evidence before changing anything.`,
				`Change one variable at a time and keep enough request, response, log, packet, or config evidence to reconstruct the lab.`,
				`Close with a defensive result: detection, mitigation, rollback, safer configuration, or verified no-regression behavior.`
			],
			[
				`Write the ${moduleTitle} scope line first: owned target, protected behavior, allowed tools, and the action that stops the lab.`,
				`Collect baseline evidence before changing the fixture, then record the smallest request, packet, command, or config change that matters.`,
				`Retest the baseline, the risky or malformed case, and the defensive fix or monitoring check.`
			],
			[
				`Separate ${moduleTitle} into asset, entry point, trust boundary, observation method, and defensive success condition.`,
				`Use reversible steps so every command, rule, request, or trace can be tied to one hypothesis about the system.`,
				`Confirm normal behavior still works after the mitigation, alerting, rollback, or hardening step.`
			],
			[
				`Name the ${moduleTitle} authorized fixture, the data that may be observed, and the evidence that would be out of scope.`,
				`Run the lab with enough logging, capture, or configuration detail to explain both the starting state and the changed state.`,
				`Compare a safe baseline, a failure-shaped case, and one defensive verification that proves the response is intentional.`
			],
			[
				`Frame ${moduleTitle} as a defensive investigation: target, permission boundary, suspected weakness, and proof needed.`,
				`Record the command, log, request, response, packet, or configuration evidence at the point where the behavior changes.`,
				`Finish with a mitigation, rollback, detection, or hardening result plus one remaining limitation.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			[
				`Identify the ${moduleTitle} inputs, ownership or lifetime boundary, build command, runtime behavior, and diagnostic output.`,
				`Implement or instrument ${moduleTitle} one boundary at a time, rebuilding and rerunning after each meaningful change.`,
				`Verify ${moduleTitle} with a normal case, a boundary or failure case, and one trace, sanitizer, debugger, memory, or performance observation.`
			],
			[
				`For ${moduleTitle}, name the command, file or memory boundary, expected runtime behavior, and evidence source before changing code.`,
				`Build the smallest reproducible ${moduleTitle} run first, then add one diagnostic, data-structure, resource, or control-flow change at a time.`,
				`Check ${moduleTitle} with a typical run, a smallest or failing run, and one observation from logs, debugger state, sanitizer output, timing, or memory state.`
			],
			[
				`Map ${moduleTitle} to its low-level contract: inputs, outputs, ownership, lifetime, build mode, and observable machine or runtime state.`,
				`Change one ${moduleTitle} boundary at a time and keep the build/run command close enough to rerun immediately.`,
				`Check ordinary behavior for ${moduleTitle}, plus a boundary or invalid case and one diagnostic trace tied to the systems concept.`
			],
			[
				`Start ${moduleTitle} by recording the starting state, command path, resource boundary, and expected observable result.`,
				`Implement ${moduleTitle} in short compile/run/debug cycles so failures point to a specific boundary or assumption.`,
				`Check ${moduleTitle} with one normal path, one failure or edge path, and one memory, lifetime, performance, register, or process-state detail.`
			],
			[
				`Define the ${moduleTitle} contract in terms of inputs, outputs, resource ownership, and the command that proves it.`,
				`Build or instrument ${moduleTitle} in slices, keeping each compile, run, or diagnostic result tied to one assumption.`,
				`Check ${moduleTitle} with a representative run, a boundary or failure run, and one observable system detail such as logs, layout, timing, or sanitizer output.`
			],
			[
				`List the ${moduleTitle} files, build target, runtime setup, and memory or resource boundary before changing implementation code.`,
				`Make one change at a time and rerun the relevant command so the cause of each output or error remains visible.`,
				`Verify the expected result, one edge condition, and one tool-backed observation from a debugger, trace, warning, sanitizer, or profiler.`
			],
			[
				`Frame ${moduleTitle} around a clear systems question: what state changes, what resource is touched, and how the evidence will be captured.`,
				`Use short command-line cycles to connect the source change to build output, runtime output, and diagnostic evidence.`,
				`Record normal behavior, abnormal or boundary behavior, and the low-level clue that explains the difference.`
			],
			[
				`Write down the ${moduleTitle} preconditions, command path, expected side effect or output, and the diagnostic signal to inspect.`,
				`Implement the smallest runnable version first, then add resource, memory, performance, or control-flow detail in verifiable steps.`,
				`Confirm the result with a clean rerun, a stress or invalid case, and one concrete machine- or tool-level observation.`
			],
			[
				`State the ${moduleTitle} source files, command, input fixture, resource ownership, and expected output before implementation.`,
				`Build the core run first, then add one diagnostic, error path, or data-structure detail at a time.`,
				`Verify the intended behavior plus one boundary case using terminal, debugger, sanitizer, trace, or log evidence.`
			],
			[
				`Describe the ${moduleTitle} runtime contract: what enters, what changes, what resource is owned, and what output proves success.`,
				`Keep each build/run cycle tied to one ownership, lifetime, layout, complexity, or command assumption.`,
				`Compare a representative run with a failure-shaped run and record the low-level evidence that explains the difference.`
			],
			[
				`Name the ${moduleTitle} command path, toolchain flags, memory or process boundary, and observable result before coding.`,
				`Change one API, allocation, loop, branch, build setting, or diagnostic hook at a time.`,
				`Finish with a repeatable run plus one trace, warning, sanitizer result, debugger observation, or timing clue.`
			],
			[
				`Frame ${moduleTitle} around the engineering question being tested: representation, ownership, lifetime, complexity, or system state.`,
				`Use small command-line checks to keep source changes, build output, runtime behavior, and diagnostics aligned.`,
				`Record evidence for the ordinary path and the path most likely to reveal a hidden systems assumption.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 12)];
	}

	if (family.includes("swift")) {
		return [
			[
				`Identify the ${moduleTitle} screen, state, user action, data flow, and expected app behavior before changing the project.`,
				`Implement one ${moduleTitle} view, model, state transition, or persistence path at a time and run it in the simulator.`,
				`Verify ${moduleTitle} with a normal interaction, an empty or invalid state, and one accessibility or navigation check.`
			],
			[
				`Map ${moduleTitle} from visible screen to state owner, user event, model data, and feedback before editing code.`,
				`Build the smallest simulator-visible path first, then add navigation, persistence, validation, or loading behavior.`,
				`Check the main interaction plus one empty, invalid, narrow-screen, or accessibility condition.`
			],
			[
				`State the ${moduleTitle} app goal as a screen, action, state change, and success signal.`,
				`Change one view, binding, model, or persistence boundary at a time and rerun the preview or simulator after meaningful steps.`,
				`Confirm that a normal path and one awkward state both produce understandable UI feedback.`
			],
			[
				`Name the ${moduleTitle} SwiftUI view, model data, navigation path, and project setting that could affect the result.`,
				`Implement in small build/run slices so layout, state, and configuration problems do not blur together.`,
				`Verify the target behavior with a successful action and one layout, accessibility, loading, or invalid-state check.`
			],
			[
				`Describe the ${moduleTitle} user story, initial state, expected state transition, and final visible screen.`,
				`Keep model changes, view changes, and project-configuration changes separately testable during implementation.`,
				`Record evidence from one simulator or preview run plus one edge condition tied to navigation, persistence, or accessibility.`
			],
			[
				`Decide the ${moduleTitle} state, data-flow, user-input, or platform behavior target before adding features.`,
				`Run the app after each important view, model, binding, or persistence change and inspect the visible result.`,
				`Finish with one ordinary interaction and one condition that checks whether the app path remains understandable.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 6)];
	}

	return [
		`Name the ${moduleTitle} artifact, input surface, output surface, state change, and success condition before building.`,
		`Build the ${moduleTitle} behavior in small observable steps, checking the result after each meaningful change.`,
		`Verify ${moduleTitle} with a normal path, a boundary or failure path, and one case tied directly to the module concept.`
	];
}

function referenceReviewStep(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"],
	hasReference: boolean
) {
	const family = courseFamily.toLowerCase();

	if (!hasReference) {
		if (
			family.includes("data") ||
			family.includes("machine learning") ||
			family.includes("ai")
		) {
			return [
				`Write a ${moduleTitle} verification note that names the evidence, sanity check, and limitation used to interpret the result.`,
				`Close ${moduleTitle} with a short note separating the observed result, the supporting evidence, and the main caveat.`,
				`Record the ${moduleTitle} input source, sanity check, and interpretation limit before treating the result as complete.`,
				`Finish ${moduleTitle} by naming the metric, trace, visualization, or baseline that supports the conclusion.`
			][variantIndex(courseFamily, moduleTitle, kind, 4)];
		}

		if (family.includes("security") || family.includes("network")) {
			return [
				`Write a ${moduleTitle} verification note that records the local boundary, evidence captured, and remediation or hardening result.`,
				`Close ${moduleTitle} with the approved scope, captured evidence, and the defensive result that changed or confirmed the system state.`,
				`Record the ${moduleTitle} boundary, diagnostic evidence, and rollback, mitigation, or hardening check.`,
				`Finish ${moduleTitle} by connecting the local evidence to impact and a safe defensive action.`
			][variantIndex(courseFamily, moduleTitle, kind, 4)];
		}

		return [
			`Write a ${moduleTitle} verification note that identifies the tests, traces, logs, or observations used as evidence.`,
			`Close ${moduleTitle} with the specific evidence used to prove the behavior, not only a statement that it works.`,
			`Record the ${moduleTitle} checks, observed result, and one boundary or troubleshooting detail for future review.`,
			`Finish ${moduleTitle} with a short evidence note naming the test, trace, log, output, or observation that supports the result.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("usaco")) {
		return [
			"After the solution samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling.",
			`Use the ${moduleTitle} reference only after local tests pass, then note one difference in proof idea, bounds handling, or complexity.`,
			`Compare ${moduleTitle} with the reference after the sample and edge case pass, focusing on invariant, implementation detail, or failure case.`,
			`After ${moduleTitle} behaves like a contest submission, use the reference to check one missed edge case or alternate invariant.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			`After the ${moduleTitle} page behavior works, compare against the reference and record one difference in UI state, validation, accessibility, or error handling.`,
			`Use the ${moduleTitle} reference after the browser path works, then note one difference in state, layout, validation, or feedback.`,
			`Compare ${moduleTitle} with the reference only after a clean browser reload succeeds, focusing on one UI or data-flow difference.`,
			`After ${moduleTitle} passes the local browser checks, record one reference difference involving interaction, accessibility, error handling, or layout.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			`After the ${moduleTitle} pipeline or model runs, compare against the reference and record one difference in data assumptions, metric behavior, model behavior, or stated limitation.`,
			`Use the ${moduleTitle} reference after the local result has evidence, then note one difference in assumptions, baseline, metric, or caveat.`,
			`Compare ${moduleTitle} with the reference by checking one data-quality choice, transformation step, score, or interpretation boundary.`,
			`After ${moduleTitle} produces a traceable result, record one reference difference that changes confidence or interpretation.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("java")) {
		const subject = guidanceSubject(courseFamily, moduleTitle);

		return [
			`After ${subject} compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage.`,
			`After the ${subject} behavior works, compare against the reference and note one difference in type design, public API, object state, or test coverage.`,
			`Run ${subject} locally first, then use the reference to compare constructor behavior, method boundaries, records/interfaces, or edge-case handling.`,
			`Compare ${subject} with the reference after the compile/run path is clean, then identify one design or robustness difference that matters.`,
			"Use the reference after the program has fresh compile/run evidence, then record one difference in class responsibility or API shape.",
			`Check ${subject} against the reference by focusing on one object-state, inheritance, interface, record, or collection decision.`
		][variantIndex(courseFamily, moduleTitle, kind, 6)];
	}

	if (family.includes("python")) {
		return [
			`After the ${moduleTitle} program runs, compare against the reference and record one difference in helper boundaries, data handling, input validation, or output formatting.`,
			`Use the ${moduleTitle} reference after local output is reproducible, then note one difference in decomposition, data flow, or edge handling.`,
			`Compare ${moduleTitle} with the reference by checking one helper, loop, collection, file, or formatting decision.`,
			`After ${moduleTitle} works locally, record one reference difference that would affect readability, robustness, or testability.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			`After the ${moduleTitle} local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path.`,
			`Use the ${moduleTitle} reference only after the local boundary and evidence are clear, then note one scope, mitigation, or diagnostic difference.`,
			`Compare ${moduleTitle} with the reference by checking one log, trace, request, response, rule, control, or rollback detail.`,
			`After ${moduleTitle} has local defensive evidence, record one reference difference that changes impact, mitigation, or recovery confidence.`
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			`After ${moduleTitle} builds and runs, compare against the reference and record one difference in ownership, memory behavior, diagnostics, or performance evidence.`,
			`Compare ${moduleTitle} with the reference only after the local command path is reproducible; note one difference in resource lifetime, trace output, or failure handling.`,
			`Use the ${moduleTitle} reference to check one systems assumption after the build is clean: ownership, layout, timing, command behavior, or diagnostic evidence.`,
			`After the ${moduleTitle} runtime evidence is captured, compare against the reference and name one boundary or tooling difference that affects confidence.`,
			`Use the reference after ${moduleTitle} has a clean command path, then compare one build, resource, memory, or diagnostic decision.`,
			`Compare ${moduleTitle} with the reference by checking one assumption about lifetime, layout, command output, error handling, or tool evidence.`,
			`After ${moduleTitle} can be reproduced from scratch, use the reference to find one difference in setup, traceability, or low-level reasoning.`,
			`Review the reference only after ${moduleTitle} has local evidence, then record one difference that changes correctness, maintainability, or confidence.`,
			`Once ${moduleTitle} has repeatable command evidence, compare one resource, diagnostic, or complexity decision with the reference.`,
			`Use the reference to audit ${moduleTitle} only after the local failure or boundary case has been tested.`,
			`Compare the ${moduleTitle} command path, cleanup path, or diagnostic evidence with the reference and record the useful difference.`,
			`After ${moduleTitle} is reproducible, use the reference to identify one missed edge case, tool setting, or ownership assumption.`
		][variantIndex(courseFamily, moduleTitle, kind, 12)];
	}

	if (family.includes("swift")) {
		return [
			`After the ${moduleTitle} simulator path works, compare against the reference and record one difference in view state, navigation, persistence, or accessibility behavior.`,
			`Use the ${moduleTitle} reference only after the local screen state is visible, then compare one view, model, navigation, or project-setting choice.`,
			`Compare ${moduleTitle} with the reference by checking one state transition, data-flow choice, layout behavior, or accessibility concern.`,
			`After ${moduleTitle} runs from a clean launch or preview, use the reference to identify one missed app-state or UI-feedback detail.`,
			`Review the ${moduleTitle} reference after the main interaction is reproducible, then record one difference in persistence, validation, or navigation behavior.`,
			`Once ${moduleTitle} has simulator or preview evidence, compare the reference for one platform, state, or layout decision that changes reliability.`
		][variantIndex(courseFamily, moduleTitle, kind, 6)];
	}

	return `After the ${moduleTitle} artifact works, compare against the reference and record one meaningful difference in behavior, robustness, readability, or design.`;
}

function completionCheckSteps(
	courseFamily: string,
	moduleTitle: string,
	kind: ProjectGuidanceOptions["projectKind"]
) {
	const family = courseFamily.toLowerCase();

	if (family.includes("usaco")) {
		return [
			[
				`The ${moduleTitle} submitted program matches the required input/output format exactly.`,
				`A tiny hand-traced ${moduleTitle} case, the sample case, and one boundary or ordering case have matching results.`,
				`The final ${moduleTitle} note names the invariant, complexity target, and one edge case that shaped the solution.`
			],
			[
				`${moduleTitle} accepts contest-style input and prints exactly the expected output with no prompts or extra text.`,
				`The sample, one hand-built tiny case, and one boundary, tie, duplicate, or ordering case agree with the trace.`,
				`The final ${moduleTitle} note explains the invariant and why the complexity fits the largest input.`
			],
			[
				`${moduleTitle} passes the official sample and preserves the required output format on custom tests.`,
				`At least one minimal case and one adversarial or constraint-shaped case are checked against hand reasoning.`,
				`The final ${moduleTitle} note names the algorithm idea, complexity, and edge case that mattered most.`
			],
			[
				`${moduleTitle} runs through stdin/stdout or the expected file contract exactly as a contest submission would.`,
				`The verification covers the sample, a traceable small case, and one non-sample case chosen to challenge the invariant.`,
				`The closing ${moduleTitle} note states the runtime, memory expectation, and one assumption tested directly.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("web") || family.includes("javascript")) {
		return [
			[
				`The ${moduleTitle} page or app shows the expected state change, output, validation, or canvas behavior.`,
				`A normal ${moduleTitle} interaction, an empty or invalid interaction, and one layout or accessibility check have been exercised.`,
				`The final ${moduleTitle} note names the event, state, DOM/canvas/API, or user-flow decision that mattered.`
			],
			[
				`${moduleTitle} can be reproduced after a fresh browser reload with the same visible result or error feedback.`,
				`Keyboard or screen-size behavior plus one invalid, empty, loading, or failed state has been checked.`,
				`The final ${moduleTitle} note connects the user action to state, data, and rendered output.`
			],
			[
				`${moduleTitle} demonstrates the intended user-facing behavior in the page, not only in source code.`,
				`The result has been checked with ordinary input, one non-ideal state, and one viewport or accessibility concern.`,
				`The final ${moduleTitle} note names the interaction, validation, rendering, or API decision that controlled the result.`
			],
			[
				`${moduleTitle} works from a clean load and gives clear feedback for the target interaction.`,
				`A normal path, a missing or invalid data path, and a responsive-layout or keyboard path have been exercised.`,
				`The closing ${moduleTitle} note records the browser evidence and the UI state decision that mattered.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (
		family.includes("data") ||
		family.includes("machine learning") ||
		family.includes("ai")
	) {
		return [
			[
				`The ${moduleTitle} result is tied to inspected input data, model/search behavior, or an explicit transformation.`,
				`A normal ${moduleTitle} case, a sanity check, and one limitation or failure mode are recorded.`,
				`The final ${moduleTitle} note separates what the evidence supports from what remains uncertain.`
			],
			[
				`${moduleTitle} includes enough intermediate evidence to connect the input source to the output.`,
				`The work checks a hand-verifiable case, a representative case, and one caveat or failure mode.`,
				`The final ${moduleTitle} note distinguishes observed behavior from interpretation.`
			],
			[
				`${moduleTitle} names the dataset, state space, features, rules, or model behavior behind the result.`,
				`A baseline, trace, metric, visualization, or sanity check supports the conclusion.`,
				`The final ${moduleTitle} note states one assumption or limitation that could change the answer.`
			],
			[
				`${moduleTitle} shows the transformation, model, search, or scoring evidence used to judge success.`,
				`The verification includes one ordinary case and one boundary, noisy, missing-data, or failure-shaped case.`,
				`The closing ${moduleTitle} note limits the claim to what the evidence can support.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 4)];
	}

	if (family.includes("java")) {
		return [
			[
				`${moduleTitle} compiles cleanly and the expected behavior is visible through output, tests, or method calls.`,
				`A normal ${moduleTitle} case, an edge case, and one object-state, inheritance, interface, record, or collection case are checked.`,
				`The final ${moduleTitle} note names the class boundary, method contract, or data representation choice that mattered.`
			],
			[
				`${moduleTitle} has a fresh compile/run result and at least one concrete output, assertion, or trace.`,
				`The ${moduleTitle} checked cases include ordinary behavior, boundary behavior, and one object or collection interaction.`,
				`The final ${moduleTitle} note explains which Java type owns the behavior and why that boundary is useful.`
			],
			[
				"The program demonstrates the required Java behavior without relying on stale build output or hidden IDE state.",
				`Constructor, method, branch, and data-representation behavior are checked for ${moduleTitle} where relevant.`,
				`The final ${moduleTitle} note names the API, state, equality, inheritance, interface, record, or collection decision that affected correctness.`
			],
			[
				`${moduleTitle} can be rebuilt and rerun with current evidence for the target behavior.`,
				`A typical ${moduleTitle} path, an awkward path, and one stateful or polymorphic path are checked when relevant.`,
				`The final ${moduleTitle} note separates syntax fixes from design choices such as encapsulation, method contracts, or data ownership.`
			],
			[
				`${moduleTitle} has a current compile/run result and the important method calls are traceable.`,
				`The checked cases include a typical call, a boundary call, and one state or collection interaction.`,
				`The final ${moduleTitle} note names the Java construct that carried the main responsibility.`
			],
			[
				`${moduleTitle} can be rebuilt from the documented files and still shows the expected behavior.`,
				`Constructor setup, public method behavior, and one awkward input or state transition are checked where relevant.`,
				`The final ${moduleTitle} note explains why the chosen class or interface boundary is useful.`
			],
			[
				`${moduleTitle} includes reproducible evidence through output, assertions, traces, or method-call examples.`,
				`A normal path, an edge path, and one object-collaboration path are verified when the prompt allows it.`,
				`The final ${moduleTitle} note separates the Java syntax issue from the design or API issue.`
			],
			[
				`${moduleTitle} demonstrates the target behavior after a clean compile, not just from previous run output.`,
				`The checked cases cover expected behavior, boundary behavior, and one class, record, interface, or collection interaction.`,
				`The final ${moduleTitle} note states which method contract or representation choice mattered most.`
			],
			[
				`${moduleTitle} rebuilds from the current files and shows the expected console output, assertion, or method trace.`,
				`Verification includes a routine call, a stress or boundary call, and one case involving stored state or collaboration between objects.`,
				`The ${moduleTitle} review identifies the Java rule that explains the result.`
			],
			[
				`${moduleTitle} has current compile evidence and a visible check for the main behavior.`,
				`The checks exercise constructor setup, public method behavior, and one awkward condition such as null risk, equality, or collection mutation where relevant.`,
				`The ${moduleTitle} summary separates syntax correctness from the API or object-design decision.`
			],
			[
				`${moduleTitle} can be rerun without relying on stale IDE output, and the expected behavior is easy to inspect.`,
				`Compare an ordinary example, an edge example, and one type-boundary example with the expected results.`,
				`The ${moduleTitle} closing note names the responsibility that belongs in the class, record, interface, or helper method.`
			],
			[
				`${moduleTitle} produces reproducible evidence through a run, unit-style check, trace, or small driver program.`,
				`The verification distinguishes input handling, object state, and method return or side-effect behavior.`,
				`The ${moduleTitle} review records the design choice that would be hardest to fix if it were wrong.`
			],
			[
				`${moduleTitle} has a clean compile/run path and evidence tied to the current source files.`,
				`The check covers the main method behavior, one boundary behavior, and one state or reference behavior where relevant.`,
				`The ${moduleTitle} review names the Java construct that made the behavior possible.`
			],
			[
				`${moduleTitle} demonstrates the intended behavior through a driver, test, trace, or recorded console output.`,
				`Verification compares a typical example with one example involving invalid input, boundary state, or object collaboration.`,
				`The ${moduleTitle} summary states the API, state, or representation decision that mattered.`
			],
			[
				`${moduleTitle} can be rebuilt and explained from the current class, record, interface, or collection structure.`,
				`The result is checked through object creation, method execution, and one awkward state transition where the prompt allows it.`,
				`The closing ${moduleTitle} note identifies what belongs in the model code versus runner or console code.`
			],
			[
				`${moduleTitle} shows current evidence for both syntax correctness and the intended object behavior.`,
				`The verification includes one straightforward example and one example chosen to expose equality, aliasing, mutation, or dispatch mistakes.`,
				`The final ${moduleTitle} review names the rule to carry into the next Java task.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 16)];
	}

	if (family.includes("python")) {
		return [
			[
				`The ${moduleTitle} program can be rerun cleanly and the expected output or data change is visible.`,
				`A normal ${moduleTitle} input, a boundary input, and one awkward input or data shape are tested or traced.`,
				`The final ${moduleTitle} note names the helper, loop, collection, file, or algorithm decision that mattered.`
			],
			[
				`${moduleTitle} has current run evidence for the intended output, not only code that appears plausible.`,
				`The checks include typical data, smallest useful data, and one input with messy formatting, duplicates, or missing pieces.`,
				`The closing ${moduleTitle} note explains which function, loop, collection, or parsing choice carried the result.`
			],
			[
				`${moduleTitle} can be started from scratch and rerun with the same visible output or saved data result.`,
				`A hand-checkable case, an empty or boundary case, and one surprising case have been compared with expectations.`,
				`The final ${moduleTitle} note separates input handling, core logic, and output formatting decisions.`
			],
			[
				`${moduleTitle} shows enough printed output, trace output, tests, or saved data to verify the behavior.`,
				`The verification covers ordinary data plus one boundary, invalid, duplicate, missing, or oddly formatted input.`,
				`The final ${moduleTitle} note names the data-flow step most responsible for correctness.`
			],
			[
				`${moduleTitle} runs with the recorded inputs and produces a result that can be checked by hand or by a small trace.`,
				`The tested cases include one standard case, one minimal case, and one case chosen to challenge an assumption.`,
				`The closing ${moduleTitle} note identifies the helper, loop, condition, collection, or file decision that mattered.`
			],
			[
				`${moduleTitle} keeps input, transformation, and output behavior inspectable in the final version.`,
				`The program has evidence for a normal path, a smallest or empty path, and one awkward data shape.`,
				`The final ${moduleTitle} note explains how the chosen Python structure made the behavior easier to verify.`
			],
			[
				`${moduleTitle} includes a fresh run or test result for the current code.`,
				`Representative, boundary, and malformed or surprising inputs are checked or traced.`,
				`The final ${moduleTitle} note names the assumption that would be easiest to break in a larger version.`
			],
			[
				`${moduleTitle} can be reproduced from a small documented input/output example.`,
				`The work checks normal behavior, one edge or invalid behavior, and one case that stresses the selected data structure.`,
				`The final ${moduleTitle} note connects the observed result to a specific helper, branch, loop, or collection operation.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
	}

	if (family.includes("security") || family.includes("network")) {
		return [
			[
				`The ${moduleTitle} lab boundary, target behavior, and evidence source are explicit.`,
				`${moduleTitle} normal traffic or behavior, failure or attack-shaped behavior, and a mitigation or diagnostic result are checked.`,
				`The final ${moduleTitle} note names the risk, control, trace, log, request, response, or rollback decision that mattered.`
			],
			[
				`${moduleTitle} stays inside the approved local or owned boundary and records the evidence source used.`,
				`Expected behavior, failure-shaped behavior, and one defensive validation or rollback path are checked.`,
				`The final ${moduleTitle} note connects the evidence to impact and mitigation.`
			],
			[
				`${moduleTitle} identifies the protected asset, trust boundary, and diagnostic or test evidence.`,
				`The lab includes normal operation plus one blocked, malformed, risky, or failure-shaped scenario.`,
				`The final ${moduleTitle} note names the defensive control or recovery decision that mattered.`
			],
			[
				`${moduleTitle} has concrete local evidence such as logs, packets, requests, responses, traces, or configuration output.`,
				`A safe baseline, a failure or attack-shaped case, and a verified mitigation or diagnostic result are recorded.`,
				`The closing ${moduleTitle} note states the scope boundary and the hardening or validation result.`
			],
			[
				`${moduleTitle} records the owned target, allowed tools, stop condition, and evidence source before interpreting results.`,
				`Baseline behavior, malformed or risky behavior, and the defensive response are all checked with concrete evidence.`,
				`The final ${moduleTitle} note separates observation, impact, mitigation, and remaining limitation.`
			],
			[
				`${moduleTitle} stays within the named fixture or local system and avoids claims beyond the collected evidence.`,
				`A normal run, a fault-shaped run, and a rollback, alerting, or hardening verification are present.`,
				`The closing ${moduleTitle} note explains why the defensive control or recovery path is sufficient for the lab.`
			],
			[
				`${moduleTitle} includes reproducible evidence from logs, traces, commands, requests, responses, packet captures, or configuration diffs.`,
				`The evidence covers the starting state, the problem-shaped case, and the final verified state.`,
				`The final ${moduleTitle} note names the trust boundary or assumption that mattered most.`
			],
			[
				`${moduleTitle} documents the authorization boundary, data observed, and defensive goal of the lab.`,
				`The checks prove normal behavior, the relevant unsafe or failure behavior, and the mitigation or monitoring result.`,
				`The closing ${moduleTitle} note connects the evidence to a practical remediation or hardening choice.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 8)];
	}

	if (
		family.includes("systems") ||
		family.includes("assembly") ||
		family.includes("rust") ||
		family.includes("c++")
	) {
		return [
			[
				`${moduleTitle} builds from a clean command and produces inspectable runtime behavior.`,
				`A normal ${moduleTitle} case, a boundary or failure case, and one memory, lifetime, trace, debugger, or performance check are recorded.`,
				`The final ${moduleTitle} note names the ownership, resource, ABI, build, diagnostic, or complexity decision that mattered.`
			],
			[
				`${moduleTitle} has a reproducible build/run command and current evidence for the expected behavior.`,
				`${moduleTitle} ordinary behavior, edge or failure behavior, and one diagnostic observation are checked.`,
				`The final ${moduleTitle} note identifies the resource, ownership, lifetime, layout, command, or performance assumption that shaped the result.`
			],
			[
				`${moduleTitle} can be rebuilt from a clean starting point and inspected through output, logs, traces, debugger state, or sanitizer evidence.`,
				`A typical ${moduleTitle} input, a boundary or invalid input, and one low-level observation are recorded.`,
				`The final ${moduleTitle} note separates the algorithm or API behavior from the system-level evidence.`
			],
			[
				`${moduleTitle} includes the command, expected output, and evidence needed to reproduce the result.`,
				`At least one ${moduleTitle} normal path, one failure or edge path, and one memory, process, register, or timing detail are checked.`,
				`The final ${moduleTitle} note explains the most important ownership, build, diagnostic, or complexity choice.`
			],
			[
				`${moduleTitle} records the build/run command and the relevant environment, input, or fixture state.`,
				`${moduleTitle} expected behavior, boundary behavior, and one tool-backed diagnostic observation are checked.`,
				`The final ${moduleTitle} note explains the resource, representation, or tooling decision that made the result trustworthy.`
			],
			[
				`${moduleTitle} can be reproduced from a clean command path with current output or test evidence.`,
				`One representative case, one invalid or stress case, and one compiler, debugger, sanitizer, log, or timing observation are included.`,
				`The final ${moduleTitle} note connects the observed system behavior to the design choice under review.`
			],
			[
				`${moduleTitle} names the source files, command, runtime state, and success signal used for verification.`,
				`The checks cover ordinary output, a boundary or failure-shaped input, and one low-level observation.`,
				`The closing ${moduleTitle} note separates what the program did from how the diagnostic evidence supports it.`
			],
			[
				`${moduleTitle} has a documented rerun path and evidence from output, tests, logs, traces, or tooling.`,
				`The verification includes a normal case, a problematic case, and one resource, lifetime, layout, timing, or process-state detail.`,
				`The final ${moduleTitle} note identifies the assumption that would be easiest to break in a larger system.`
			],
			[
				`${moduleTitle} has current evidence from a clean build/run command, not only from prior IDE output.`,
				`The checks include the intended run, one boundary or failure-shaped run, and one warning, trace, log, sanitizer, or debugger observation.`,
				`The ${moduleTitle} review names the resource, lifetime, layout, complexity, or command assumption that controlled the result.`
			],
			[
				`${moduleTitle} can be rerun from documented source files, command flags, input state, and cleanup assumptions.`,
				`Verification compares expected output with one stress, malformed, timing, memory, or process-state condition.`,
				`The closing ${moduleTitle} note connects the diagnostic evidence to the systems concept being practiced.`
			],
			[
				`${moduleTitle} records the build target, runtime input, observable output, and diagnostic source used for verification.`,
				`At least one ordinary path and one edge path are checked with concrete terminal or tool evidence.`,
				`The ${moduleTitle} summary separates program behavior from compiler, linker, debugger, sanitizer, or runtime-environment behavior.`
			],
			[
				`${moduleTitle} shows the expected behavior through repeatable output, logs, traces, tests, or instrumentation.`,
				`The verification includes a representative path, an awkward path, and one low-level clue tied to ownership, layout, or resource use.`,
				`The final ${moduleTitle} review identifies the assumption that must stay true for the artifact to remain correct.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 12)];
	}

	if (family.includes("swift")) {
		return [
			[
				`The ${moduleTitle} app path runs in the simulator or preview and shows the expected view/state behavior.`,
				`A normal ${moduleTitle} interaction, an empty or invalid state, and one navigation, persistence, or accessibility check are exercised.`,
				`The final ${moduleTitle} note names the view, model, state, data-flow, or platform decision that mattered.`
			],
			[
				`${moduleTitle} reaches the intended screen from a clean launch or preview state.`,
				`The check covers a normal interaction, one empty or invalid state, and one layout, navigation, or accessibility condition.`,
				`The ${moduleTitle} review identifies whether the important choice lived in the view, model, state owner, or project setup.`
			],
			[
				`${moduleTitle} has current simulator, preview, or device evidence for the target app behavior.`,
				`State changes, visible feedback, and one edge condition such as missing data, invalid input, or navigation reversal are checked.`,
				`The ${moduleTitle} summary ties the result to a Swift, SwiftUI, persistence, or platform decision.`
			],
			[
				`${moduleTitle} can be demonstrated after a fresh build/run cycle with the expected screen state visible.`,
				`The app is checked for the main path plus one device-size, accessibility, loading, empty, or failed-state concern.`,
				`The ${moduleTitle} note records the state transition or data-flow boundary that controlled the behavior.`
			],
			[
				`${moduleTitle} shows the intended user path without relying only on source-code inspection.`,
				`The verification includes a successful interaction and one condition that tests navigation, persistence, validation, or layout resilience.`,
				`The ${moduleTitle} review names the app layer that made the result reliable.`
			],
			[
				`${moduleTitle} has a repeatable preview or simulator path and clear evidence for the expected result.`,
				`One ordinary action, one awkward state, and one accessibility or project-configuration check are included.`,
				`The ${moduleTitle} closing note separates UI behavior from state, model, or configuration behavior.`
			]
		][variantIndex(courseFamily, moduleTitle, kind, 6)];
	}

	return [
		`The finished ${moduleTitle} artifact has an observable result tied to the module concept.`,
		`A normal ${moduleTitle} case, a boundary or failure case, and one transfer case have been checked.`,
		`The final ${moduleTitle} note names one design, debugging, or reasoning decision that affected the outcome.`
	];
}

function projectPathNote({
	itemTitle,
	projectKind,
	hasReference
}: Pick<ProjectGuidanceOptions, "itemTitle" | "projectKind" | "hasReference">) {
	const label = itemTitle?.toLowerCase() ?? "";

	if (label.includes("worked example")) {
		return "**Path:** Model version. It exposes the setup, reasoning, expected evidence, and one common mistake before independent practice begins.";
	}

	if (label.includes("transfer")) {
		return "**Path:** Transfer version. The same core idea appears with changed data, representation, constraints, or context so the concept is not tied to the first example.";
	}

	if (label.includes("extension") || label.includes("challenge")) {
		return "**Path:** Extension version. The working base case comes first, followed by a harder constraint, extra edge case, design variation, or deeper explanation target.";
	}

	if (label.includes("review")) {
		return "**Path:** Review check. The main idea is compressed into a short artifact, then the weakest prerequisite or misconception is verified before moving forward.";
	}

	if (projectKind === "core") {
		return hasReference
			? "**Path:** Core implementation. The first complete version is built and verified independently before comparison with the reference."
			: "**Path:** Core implementation. The first complete version is verified with one normal case plus one boundary or failure case.";
	}

	return hasReference
		? "**Path:** Independent practice. One meaningful condition changes from the core version, and comparison with the reference happens after the evidence is recorded."
		: "**Path:** Independent practice. One meaningful condition changes from the core version, followed by a record of what still works, what breaks, and why.";
}

export function buildProjectGuidance({
	courseFamily,
	moduleTitle,
	itemTitle,
	projectKind,
	hasReference
}: ProjectGuidanceOptions) {
	const scopedModuleTitle = guidanceModuleTitle(moduleTitle, itemTitle);
	const goal = projectGoal(courseFamily, scopedModuleTitle, projectKind);
	const pathNote = projectPathNote({ itemTitle, projectKind, hasReference });
	const body = [
		`**Focus:** ${focusFor(courseFamily, scopedModuleTitle, projectKind)}.`,
		"**Required work:**",
		...requiredWorkSteps(courseFamily, scopedModuleTitle, projectKind).map(
			(step, index) => `${index + 1}. ${step}`
		),
		`4. ${referenceReviewStep(courseFamily, scopedModuleTitle, projectKind, hasReference)}`,
		"**Completion checks:**",
		...completionCheckSteps(
			courseFamily,
			scopedModuleTitle,
			projectKind
		).map(step => `- ${step}`)
	].join("\n\n");

	return normalizeGeneratedGuidanceText(
		courseFamily,
		[
			goal,
			pathNote,
			compactGuidanceBody(courseFamily, scopedModuleTitle, body)
		].join("\n\n")
	);
}
