import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { applyCourseImplementationArtifacts } from "./course-implementation-artifacts";
import { buildProjectGuidance } from "./projectGuidance";
import { applyResearchBackedExpansions } from "./research-expansions";
import {
	canonicalStaticMediaUrl,
	hasPendingStaticMediaNotice,
	isKnownPendingStaticMediaUrl,
	normalizeStaticMediaUrlsInText,
	pendingStaticMediaNotice,
	staticMediaFilename,
	staticMediaUrlsFromText
} from "./staticMedia";

const INSTRUCTION_MATERIAL_BASE = "https://github.com/instruction-material";
const CLASSROOM_BASE_COURSE_IDS: Record<string, string> = {
	"pygames-classroom": "pygames",
	"python-level-1-classroom": "python-level-1",
	"python-level-2-classroom": "python-level-2"
};

const itemLinkKeys = [
	"projectLink",
	"solutionLink",
	"datasetLink",
	"mediaLink"
] as const;

type LinkKey = (typeof itemLinkKeys)[number];

function cloneItem(item: RawCourseModuleItem): RawCourseModuleItem {
	return { ...item };
}

function cloneModule(module: RawCourseModule): RawCourseModule {
	return {
		...module,
		curriculum: module.curriculum.map(cloneItem),
		supplementalProjects: module.supplementalProjects.map(cloneItem)
	};
}

function cloneCourse(course: RawCourse): RawCourse {
	return {
		...course,
		modules: course.modules.map(cloneModule)
	};
}

function orderedModules(course: RawCourse, titles: string[]) {
	const byTitle = new Map(
		course.modules.map(module => [module.title, module])
	);
	const usedTitles = new Set(titles);

	return [
		...titles.flatMap(title => {
			const module = byTitle.get(title);
			return module ? [module] : [];
		}),
		...course.modules.filter(module => !usedTitles.has(module.title))
	];
}

function removeModules(
	course: RawCourse,
	shouldRemove: (module: RawCourseModule) => boolean
) {
	course.modules = course.modules.filter(module => !shouldRemove(module));
}

function updateCourseLinks(
	course: RawCourse,
	rewrite: (
		url: string,
		context: {
			module: RawCourseModule;
			item: RawCourseModuleItem;
			key: LinkKey;
		}
	) => string
) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			for (const key of itemLinkKeys) {
				const value = item[key];
				if (!value) continue;
				item[key] = rewrite(value, { module, item, key });
			}
		}
	}
}

function appendPendingStaticMediaNotices(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const filenames = new Set(
				[
					...itemLinkKeys.map(key => item[key]),
					...staticMediaUrlsFromText(item.content)
				]
					.filter(
						(value): value is string =>
							!!value && isKnownPendingStaticMediaUrl(value)
					)
					.map(staticMediaFilename)
			);

			for (const filename of filenames) {
				if (hasPendingStaticMediaNotice(item.content, filename)) {
					continue;
				}

				item.content = [
					item.content.trim(),
					pendingStaticMediaNotice(filename)
				]
					.filter(Boolean)
					.join("\n\n");
			}
		}
	}
}

function normalizeStaticMediaUrls(course: RawCourse) {
	updateCourseLinks(course, url => canonicalStaticMediaUrl(url) ?? url);

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.content = normalizeStaticMediaUrlsInText(item.content);
		}
	}
}

function removeSupplementals(
	course: RawCourse,
	moduleTitle: string,
	shouldRemove: (item: RawCourseModuleItem) => boolean
) {
	const module = course.modules.find(module => module.title === moduleTitle);
	if (!module) return;
	module.supplementalProjects = module.supplementalProjects.filter(
		item => !shouldRemove(item)
	);
}

function renameModule(course: RawCourse, fromTitle: string, toTitle: string) {
	const module = course.modules.find(module => module.title === fromTitle);
	if (module) module.title = toTitle;
}

function setItemLinks(
	course: RawCourse,
	moduleTitle: string,
	itemTitle: string,
	links: Pick<RawCourseModuleItem, "projectLink" | "solutionLink">
) {
	const module = course.modules.find(module => module.title === moduleTitle);
	const item = module
		? [...module.curriculum, ...module.supplementalProjects].find(
				item => item.title === itemTitle
			)
		: null;
	if (!item) return;
	if (links.projectLink) item.projectLink = links.projectLink;
	if (links.solutionLink) item.solutionLink = links.solutionLink;
}

function cleanTitleText(text: string) {
	return text
		.replace(/\(COPY\)/g, "")
		.replace(/\s{2,}/g, " ")
		.trim();
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

function supplementalLabLabelReplacement(_match: string, number: string) {
	return supplementalPurposeLabel(number).replace("Practice", "Lab");
}

function compactTitleFocus(text: string, fallback: string) {
	const compacted = cleanTitleText(text)
		.replace(
			/:\s*(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Understanding Check|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review and Reflection|Standards Practice Set|Verification and Reflection)$/i,
			""
		)
		.replace(
			/^(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Understanding Check|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review|Standards Practice Set|Verification Review):\s*/i,
			""
		)
		.replace(/^(?:Module|Unit|Chapter)\s+\d+\s*[:.-]?\s*/i, "")
		.replace(/^Check-In\s+#(\d+)\s*[:.-]?\s*/i, "Check-In $1: ")
		.replace(/^J\d+X?\d+\s*[:.-]?\s*/i, "")
		.replace(/^[A-Z]{1,6}\d+[A-Z]?\s*[:.-]?\s*/i, "")
		.replace(/^(?:Applied|Implementation) (?:Lab|Studio):\s*/i, "")
		.replace(/:\s*(?:Applied|Implementation) (?:Lab|Studio)$/i, "")
		.replace(/:+\s*$/g, "")
		.replace(/\s{2,}/g, " ")
		.trim();

	if (
		!compacted ||
		/^(?:Application Check|Core Concepts|Master Project|Setup and Tooling)$/i.test(
			compacted
		)
	) {
		return fallback;
	}

	return compacted;
}

function genericTitleLabel(label: string) {
	const labels: Record<string, string> = {
		"Review and Reflection": "Review",
		"Verification and Reflection": "Verification Review"
	};

	return labels[label] ?? label;
}

function contextualGenericTitle(
	courseTitle: string,
	moduleTitle: string,
	label: string,
	focusSource = moduleTitle
) {
	const focus = compactTitleFocus(focusSource, courseTitle);

	return `${genericTitleLabel(label)}: ${focus}`;
}

function compactContextualTitleFocus(
	courseTitle: string,
	moduleTitle: string,
	focusSource: string
) {
	const compacted = compactTitleFocus(focusSource, courseTitle)
		.replace(/^Check-In\s+\d+:\s*/i, "")
		.replace(/^Master Project:\s*/i, "")
		.replace(/^Module Project:\s*/i, "")
		.replace(/^Course\s+Path:\s*/i, "")
		.replace(/^SADX\s+/i, "")
		.replace(/^Defensive\s+/i, "")
		.replace(/^Java Level \d+:\s*/i, "")
		.replace(/^JavaScript Level \d+:\s*/i, "")
		.replace(/^Algebra\s+\d+[AB]?\s+/i, "")
		.replace(/^[A-Z]{1,6}\d+(?:\.\d+)?\s*[:.-]?\s*/i, "")
		.replace(/\s{2,}/g, " ")
		.trim();
	const focus = compacted || compactTitleFocus(moduleTitle, courseTitle);

	if (!focus.includes(":")) return focus;

	const parts = focus
		.split(":")
		.map(part => part.trim())
		.filter(Boolean);
	const finalPart = parts.at(-1) ?? focus;

	return finalPart.length >= 4 ? finalPart : focus;
}

function contextualCheckInTitle(
	courseTitle: string,
	moduleTitle: string,
	checkInNumber: string
) {
	const focus = compactContextualTitleFocus(
		courseTitle,
		moduleTitle,
		moduleTitle
	);
	if (!/^Check-In\s+#?\d+$/i.test(focus)) {
		return `${focus} Check-In ${checkInNumber}`;
	}

	const javaLevelMatch = moduleTitle.match(/^Java Level\s+(\d+):/i);
	if (
		javaLevelMatch &&
		/^Java (?:with|without) Graphics$/i.test(courseTitle)
	) {
		return `${courseTitle} Level ${javaLevelMatch[1]} Check-In ${checkInNumber}`;
	}

	return `${courseTitle} Check-In ${checkInNumber}`;
}

function contextualModuleFocus(courseTitle: string, moduleTitle: string) {
	const focus = compactContextualTitleFocus(
		courseTitle,
		moduleTitle,
		moduleTitle
	);
	if (!/^Master Project$/i.test(focus)) return focus;

	const javaLevelMatch = moduleTitle.match(/^Java Level\s+(\d+):/i);
	if (
		javaLevelMatch &&
		/^Java (?:with|without) Graphics$/i.test(courseTitle)
	) {
		return `${courseTitle} Level ${javaLevelMatch[1]}`;
	}

	return courseTitle;
}

function courseTrackTitlePrefix(courseTitle: string, moduleTitle: string) {
	const javaLevelMatch = moduleTitle.match(/^Java Level\s+(\d+):/i);
	if (
		javaLevelMatch &&
		/^Java (?:with|without) Graphics$/i.test(courseTitle)
	) {
		return `${courseTitle} Level ${javaLevelMatch[1]}`;
	}

	return courseTitle;
}

function compactGeneratedDisplayTitle(
	courseTitle: string,
	moduleTitle: string,
	itemTitle: string
) {
	if (
		/^(?:Maps|Using a Java Map|Conditionals|For Loops|While Loops|Stacks)$/i.test(
			itemTitle
		)
	) {
		return `${courseTrackTitlePrefix(courseTitle, moduleTitle)} ${itemTitle}`;
	}

	if (/^Checkpoint:\s*Trace the Project State$/i.test(itemTitle)) {
		return `State Trace: ${contextualModuleFocus(courseTitle, moduleTitle)}`;
	}

	const setupPracticeMatch = itemTitle.match(
		/^Setup and Tooling (Transfer Practice|Extension Practice)$/i
	);
	if (setupPracticeMatch) {
		return `${courseTitle} Setup ${setupPracticeMatch[1]}`;
	}

	const masterProjectPracticeMatch = itemTitle.match(
		/^Master Project (Transfer Practice|Extension Practice)$/i
	);
	if (masterProjectPracticeMatch) {
		return `${contextualModuleFocus(
			courseTitle,
			moduleTitle
		)} Master Project ${masterProjectPracticeMatch[1]}`;
	}

	if (/^Course Recap$/i.test(itemTitle)) {
		return `${contextualModuleFocus(courseTitle, moduleTitle)} Course Recap`;
	}

	if (/^Master Project Presentation$/i.test(itemTitle)) {
		return `${contextualModuleFocus(
			courseTitle,
			moduleTitle
		)} Master Project Presentation`;
	}

	const checkInLabelMatch = itemTitle.match(
		/^Check-In\s+#?(\d+)\s+(Overview|Core Concepts|Extension Challenge)$/i
	);
	if (checkInLabelMatch) {
		return `${contextualCheckInTitle(
			courseTitle,
			moduleTitle,
			checkInLabelMatch[1]
		)} ${checkInLabelMatch[2]}`;
	}

	const checkInReviewHeadingMatch = itemTitle.match(
		/^(Review Targets|Representative Review Problems)$/i
	);
	const moduleCheckInMatch = moduleTitle.match(/^Check-In\s+#?(\d+)$/i);
	if (checkInReviewHeadingMatch && moduleCheckInMatch) {
		return `${contextualCheckInTitle(
			courseTitle,
			moduleTitle,
			moduleCheckInMatch[1]
		)} ${checkInReviewHeadingMatch[1]}`;
	}

	const additionalPracticeMatch = itemTitle.match(
		/^Check-In\s+#?(\d+):\s+Additional Practice Project$/i
	);
	if (additionalPracticeMatch) {
		return `${contextualCheckInTitle(
			courseTitle,
			moduleTitle,
			additionalPracticeMatch[1]
		)} Practice Project`;
	}

	const labels = [
		"Applied Challenge",
		"Challenge Lab",
		"Challenge Practice",
		"Core Project",
		"Debugging and Failure Modes",
		"Diagnostic Checkpoint",
		"Understanding Check",
		"Extension Challenge",
		"Extension Lab",
		"Extension Practice",
		"Fluency Drill",
		"Focused Practice",
		"Modeling or Error Analysis",
		"Open-Ended Variant",
		"Planning and Architecture",
		"Review",
		"Review and Reflection",
		"Standards Practice Set",
		"Transfer Lab",
		"Transfer Practice",
		"Verification Review",
		"Verification and Reflection"
	].sort((left, right) => right.length - left.length);
	const normalizedTitle = itemTitle.toLowerCase();
	const leadingLabel = labels.find(label =>
		normalizedTitle.startsWith(`${label.toLowerCase()}:`)
	);
	if (leadingLabel) {
		const label = genericTitleLabel(leadingLabel);
		const topic = compactContextualTitleFocus(
			courseTitle,
			moduleTitle,
			itemTitle.slice(leadingLabel.length + 1).trim()
		);

		const checkInTopicMatch = topic.match(/^Check-In\s+#?(\d+)$/i);
		if (checkInTopicMatch) {
			return `${contextualCheckInTitle(
				courseTitle,
				moduleTitle,
				checkInTopicMatch[1]
			)} ${label}`;
		}

		return `${label}: ${topic}`;
	}

	const trailingLabel = labels.find(label =>
		normalizedTitle.endsWith(` ${label.toLowerCase()}`)
	);
	if (!trailingLabel) return itemTitle;

	const topic = itemTitle.slice(0, -trailingLabel.length).trim();
	if (!sameTitle(topic, moduleTitle)) return itemTitle;

	const label = genericTitleLabel(trailingLabel);
	const compactedTopic = compactContextualTitleFocus(
		courseTitle,
		moduleTitle,
		moduleTitle
	);

	const compactedCheckInTopicMatch =
		compactedTopic.match(/^Check-In\s+#?(\d+)$/i);
	if (compactedCheckInTopicMatch) {
		return `${contextualCheckInTitle(
			courseTitle,
			moduleTitle,
			compactedCheckInTopicMatch[1]
		)} ${label}`;
	}

	return `${label}: ${compactedTopic}`;
}

function cleanDisplayTitle(text: string) {
	return cleanTitleText(text)
		.replace(/\bTodo\b/g, "To-Do")
		.replace(/\bTo-do\b/g, "To-Do")
		.replace(/\bCheck[ -]in\b/gi, "Check-In")
		.replace(/ supplemental (\d+)/i, " Supplemental $1")
		.replace(/^ai search lab (\d+):/i, "AI Search Lab $1:")
		.replace(/^assembly lab (\d+):/i, "Assembly Lab $1:")
		.replace(/^c algorithm lab (\d+):/i, "C++ Algorithm Lab $1:")
		.replace(/^c foundations build (\d+):/i, "C++ Foundations Build $1:")
		.replace(/^chemistry lab:/i, "Chemistry Lab:")
		.replace(/^cpp practice:/i, "C++ Practice:")
		.replace(/^data analysis lab (\d+):/i, "Data Analysis Lab $1:")
		.replace(/^full stack web lab (\d+):/i, "Full-Stack Web Lab $1:")
		.replace(/^graphics:/i, "Graphics:")
		.replace(
			/^j1x0\d java foundations build (\d+):/i,
			"Java Foundations Build $1:"
		)
		.replace(/^language bridge lab (\d+):/i, "Language Bridge Lab $1:")
		.replace(/^linux systems lab (\d+):/i, "Linux Systems Lab $1:")
		.replace(
			/^low level security lab (\d+):/i,
			"Low-Level Security Lab $1:"
		)
		.replace(/^network security lab (\d+):/i, "Network Security Lab $1:")
		.replace(/^network systems lab (\d+):/i, "Network Systems Lab $1:")
		.replace(
			/^offensive security lab (\d+):/i,
			"Offensive Security Lab $1:"
		)
		.replace(
			/^pattern implementation lab (\d+):/i,
			"Pattern Implementation Lab $1:"
		)
		.replace(/^physics lab:/i, "Physics Lab:")
		.replace(/^physics problem lab:/i, "Physics Problem Lab:")
		.replace(/^refactoring clinic (\d+):/i, "Refactoring Clinic $1:")
		.replace(/^systems build (\d+):/i, "Systems Build $1:")
		.replace(/: ai search lab (\d+)/i, ": AI Search Lab $1")
		.replace(/: assembly lab (\d+)/i, ": Assembly Lab $1")
		.replace(/: c algorithm lab (\d+)/i, ": C++ Algorithm Lab $1")
		.replace(/: c foundations build (\d+)/i, ": C++ Foundations Build $1")
		.replace(/: chemistry lab$/i, ": Chemistry Lab")
		.replace(/: cpp practice$/i, ": C++ Practice")
		.replace(/: data analysis lab (\d+)/i, ": Data Analysis Lab $1")
		.replace(/: full stack web lab (\d+)/i, ": Full-Stack Web Lab $1")
		.replace(/: graphics$/i, ": Graphics")
		.replace(/^images:/i, "Images:")
		.replace(/: images$/i, ": Images")
		.replace(
			/: j1x01 java foundations build (\d+)/i,
			": Java Foundations Build $1"
		)
		.replace(/: language bridge lab (\d+)/i, ": Language Bridge Lab $1")
		.replace(/: linux systems lab (\d+)/i, ": Linux Systems Lab $1")
		.replace(
			/: low level security lab (\d+)/i,
			": Low-Level Security Lab $1"
		)
		.replace(/: network security lab (\d+)/i, ": Network Security Lab $1")
		.replace(/: network systems lab (\d+)/i, ": Network Systems Lab $1")
		.replace(
			/: offensive security lab (\d+)/i,
			": Offensive Security Lab $1"
		)
		.replace(
			/: pattern implementation lab (\d+)/i,
			": Pattern Implementation Lab $1"
		)
		.replace(/: physics lab$/i, ": Physics Lab")
		.replace(/: physics problem lab$/i, ": Physics Problem Lab")
		.replace(/: refactoring clinic (\d+)/i, ": Refactoring Clinic $1")
		.replace(/: systems build (\d+)/i, ": Systems Build $1");
}

function sameTitle(left: string, right: string) {
	return (
		left.localeCompare(right, undefined, { sensitivity: "accent" }) === 0
	);
}

function withCourseContext(courseTitle: string, moduleTitle: string) {
	const normalizedCourse = courseTitle.trim().toLowerCase();
	const normalizedModule = moduleTitle.trim().toLowerCase();

	if (!normalizedCourse || normalizedModule.startsWith(normalizedCourse)) {
		return moduleTitle;
	}

	return `${courseTitle}: ${moduleTitle}`;
}

function genericSupplementalNeedsCourseContext(moduleTitle: string) {
	return /^(?:Check-In #\d+|Master Project|Setup and Tooling)$/i.test(
		moduleTitle
	);
}

function contextualizeGenericItemTitle(
	courseTitle: string,
	moduleTitle: string,
	itemTitle: string
) {
	if (itemTitle === "Diagnostic Checkpoint") {
		return "Understanding Check";
	}

	const supplementalMatch = itemTitle.match(/^(.+?) Supplemental ([2-9])$/i);
	if (!supplementalMatch) return itemTitle;

	const baseTitle = cleanDisplayTitle(supplementalMatch[1]);
	const number = supplementalMatch[2];
	const label = supplementalPurposeLabel(number);

	if (
		sameTitle(baseTitle, moduleTitle) ||
		genericSupplementalNeedsCourseContext(moduleTitle)
	) {
		return contextualGenericTitle(courseTitle, moduleTitle, label);
	}

	return contextualGenericTitle(courseTitle, moduleTitle, label, baseTitle);
}

function normalizeDisplayTitles(course: RawCourse) {
	for (const module of course.modules) {
		module.title = cleanDisplayTitle(module.title);
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = cleanDisplayTitle(item.title);
			item.title = contextualizeGenericItemTitle(
				course.name,
				module.title,
				item.title
			);
		}
	}
}

function escapedRegExp(text: string) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function conciseGenericItemTitle(suffix: string) {
	const trimmed = suffix.trim();
	const supplementalMatch = trimmed.match(
		/^Supplemental(?: Project| Practice)? ([2-9])$/i
	);

	if (supplementalMatch) {
		return supplementalPurposeLabel(supplementalMatch[1]);
	}

	const genericSuffixes = new Set([
		"Applied Challenge",
		"Core Project",
		"Debugging and Failure Modes",
		"Diagnostic Checkpoint",
		"Understanding Check",
		"Extension Challenge",
		"Fluency Drill",
		"Focused Practice",
		"Modeling or Error Analysis",
		"Open-Ended Variant",
		"Planning and Architecture",
		"Review and Reflection",
		"Standards Practice Set",
		"Verification and Reflection"
	]);

	if (trimmed === "Diagnostic Checkpoint") return "Understanding Check";

	return genericSuffixes.has(trimmed) ? trimmed : null;
}

function conciseGenericColonTitle(title: string) {
	const colonIndex = title.lastIndexOf(":");
	if (colonIndex < 0) return null;

	return conciseGenericItemTitle(title.slice(colonIndex + 1));
}

function contextualizeGenericDisplayTitles(course: RawCourse) {
	const genericTitles = new Set([
		"Applied Challenge",
		"Challenge Lab",
		"Challenge Practice",
		"Core Project",
		"Debugging and Failure Modes",
		"Diagnostic Checkpoint",
		"Understanding Check",
		"Extension Challenge",
		"Extension Lab",
		"Extension Practice",
		"Fluency Drill",
		"Focused Practice",
		"Modeling or Error Analysis",
		"Open-Ended Variant",
		"Planning and Architecture",
		"Review and Reflection",
		"Standards Practice Set",
		"Transfer Lab",
		"Transfer Practice",
		"Verification and Reflection"
	]);

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const standaloneSupplemental = conciseGenericItemTitle(item.title);
			if (standaloneSupplemental) {
				item.title = contextualGenericTitle(
					course.name,
					module.title,
					standaloneSupplemental
				);
				continue;
			}

			if (genericTitles.has(item.title)) {
				item.title = contextualGenericTitle(
					course.name,
					module.title,
					item.title
				);
				continue;
			}

			const colonSuffix = conciseGenericColonTitle(item.title);
			if (!colonSuffix) continue;

			item.title = contextualGenericTitle(
				course.name,
				module.title,
				colonSuffix,
				item.title
			);
		}
	}
}

function compactGeneratedDisplayTitles(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = compactGeneratedDisplayTitle(
				course.name,
				module.title,
				item.title
			);
		}
	}
}

function normalizeGeneratedSupplementalLabel(text: string) {
	return text
		.replace(
			/\bSupplemental\s+([2-9])\s*:\s*(?:Implementation|Applied)\s+Lab\b/gi,
			supplementalLabLabelReplacement
		)
		.replace(
			/\bSupplemental\s+Practice\s+([2-9])\b/gi,
			supplementalPurposeLabelReplacement
		)
		.replace(
			/\bSupplemental\s+([2-9])\b/gi,
			supplementalPurposeLabelReplacement
		);
}

function normalizeGeneratedSupplementalLabels(course: RawCourse) {
	for (const module of course.modules) {
		module.title = normalizeGeneratedSupplementalLabel(module.title);
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.title = normalizeGeneratedSupplementalLabel(item.title);
				item.content = normalizeGeneratedSupplementalLabel(
					item.content
				);
			}
		}
	}
}

function generatedGuidanceVariantFocus(
	course: RawCourse,
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	const subject = removeRedundantItemTitleContext(
		course,
		module,
		cleanDisplayTitle(item.title)
	);
	const variant = stableVariantIndex(
		`${course.name}|${module.title}|${item.title}`,
		4
	);

	if (/core project/i.test(item.title)) {
		return `${subject} establishes the required baseline behavior first. The result identifies the main artifact, standard success path, and one protected boundary case before optional variants are attempted.`;
	}

	if (/transfer/i.test(item.title)) {
		return [
			`${subject} keeps the core concept intact while changing the case structure, representation, context, or constraint. The evidence shows whether the idea works outside the first example.`,
			`${subject} applies the same idea in a nearby setting, then names what changed, what stayed stable, and what evidence supports the transfer.`,
			`${subject} tests whether the base reasoning survives a changed value, representation, or constraint by making the difference from the base task explicit.`,
			`${subject} moves the concept into a second context while preserving the main success condition, then explains which part transferred cleanly and which part needed adjustment.`
		][variant];
	}

	if (/extension/i.test(item.title)) {
		return [
			`${subject} starts from the working base case, then adds a harder edge case, extra rule, design variation, or deeper explanation target. The evidence shows what changed and why the original reasoning still holds.`,
			`${subject} adds one meaningful difficulty after the base version works, then identifies the new requirement, the evidence that checks it, and the limitation it exposes.`,
			`${subject} deepens the task by changing one constraint or adding one edge case, with an explanation of how the base reasoning was adapted rather than only expanded.`,
			`${subject} extends the original work with a new rule, representation, or explanation target and compares the base behavior with the extended behavior.`
		][variant];
	}

	if (/challenge/i.test(item.title)) {
		return `${subject} raises the independence bar: define the success condition, choose the verification evidence, and explain one tradeoff or failure mode that was not visible in the simpler version.`;
	}

	return `${subject} names the changed condition, the new evidence required, and the reason this version is not just a copy of the previous task.`;
}

function distinguishDuplicateGeneratedProjectGuidance(course: RawCourse) {
	for (const module of course.modules) {
		const generatedProjectGroups = new Map<string, RawCourseModuleItem[]>();

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				if (
					!item.projectLink ||
					!/^\*\*(?:Goal|Project goal):\*\*/i.test(item.content)
				) {
					continue;
				}

				const normalizedContent = item.content
					.replace(/\s+/g, " ")
					.trim();
				const group =
					generatedProjectGroups.get(normalizedContent) ?? [];
				group.push(item);
				generatedProjectGroups.set(normalizedContent, group);
			}
		}

		for (const group of generatedProjectGroups.values()) {
			if (group.length < 2) continue;

			for (const item of group) {
				if (/\*\*(?:Variant|Variant focus):\*\*/i.test(item.content))
					continue;

				item.content = [
					item.content.trim(),
					`**Variant:** ${generatedGuidanceVariantFocus(course, module, item)}`
				].join("\n\n");
			}
		}
	}
}

function removeRedundantItemTitleContext(
	course: RawCourse,
	module: RawCourseModule,
	title: string
) {
	const prefixes = [
		module.title,
		withCourseContext(course.name, module.title)
	].filter(Boolean);

	for (const prefix of prefixes) {
		const escapedPrefix = escapedRegExp(prefix);
		const colonMatch = title.match(
			new RegExp(`^${escapedPrefix}:\\s*(.+)$`, "i")
		);
		const colonSuffix = colonMatch
			? conciseGenericItemTitle(colonMatch[1])
			: null;
		if (colonSuffix) {
			return contextualGenericTitle(
				course.name,
				module.title,
				colonSuffix,
				prefix
			);
		}

		const spacedMatch = title.match(
			new RegExp(
				`^${escapedPrefix}\\s+(Supplemental(?: Project| Practice)? [23])$`,
				"i"
			)
		);
		const spacedSuffix = spacedMatch
			? conciseGenericItemTitle(spacedMatch[1])
			: null;
		if (spacedSuffix) {
			return contextualGenericTitle(
				course.name,
				module.title,
				spacedSuffix,
				prefix
			);
		}
	}

	const colonSuffix = conciseGenericColonTitle(title);
	return colonSuffix
		? contextualGenericTitle(course.name, module.title, colonSuffix, title)
		: title;
}

function normalizeContextualItemTitles(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = removeRedundantItemTitleContext(
				course,
				module,
				item.title
			);
		}
	}
}

function addSolutionIfMissing(
	course: RawCourse,
	shouldUpdate: (item: RawCourseModuleItem) => boolean,
	solutionLink: string
) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (shouldUpdate(item) && !item.solutionLink) {
				item.solutionLink = solutionLink;
			}
		}
	}
}

function githubTree(repo: string, path: string) {
	return `${INSTRUCTION_MATERIAL_BASE}/${repo}/tree/main/${path}`;
}

const projectLikeTitlePattern =
	/project|capstone|challenge|lab|practice|drill|notebook|audit|reflection|review|build|create|implement|exercise/i;

const explicitProjectTitlePattern = new RegExp(
	[
		"^(?:(?:[A-Z]{2,}\\d+(?:\\.\\d+)?|Unit\\s+\\d+)\\s+)?",
		"(?:Core Project|Project|Practice Project|Extension Project|Extension Challenge|Capstone|Master Project|",
		"Supplemental Project|Catalog Project|Graphics Java Project|Guided Practice|Data Practice|Simulation Practice|",
		"Readiness Check|Checkpoint:|Extension:|Supplemental:|Design Exercise:)"
	].join(""),
	"i"
);

const informationalResourceTitlePattern = new RegExp(
	`\\b(?:${[
		"answer key",
		"archive",
		"course asset",
		"free response",
		"frq",
		"guide",
		"handbook",
		"materials?",
		"multiple choice",
		"official scoring",
		"practice exam",
		"reference",
		"resource",
		"rubric",
		"scoring guidelines",
		"setup checklist",
		"textbook",
		"worksheet"
	].join("|")})\\b`,
	"i"
);

function isExplicitProjectItemTitle(title: string) {
	return (
		explicitProjectTitlePattern.test(title) ||
		/\b(?:Extension|Transfer) Practice\b/i.test(title)
	);
}

function isInformationalResourceItem(item: RawCourseModuleItem) {
	return (
		!isExplicitProjectItemTitle(item.title) &&
		informationalResourceTitlePattern.test(item.title)
	);
}

function isProjectLikeItem(item: RawCourseModuleItem) {
	return (
		!isInformationalResourceItem(item) &&
		(projectLikeTitlePattern.test(item.title) ||
			Boolean(item.projectLink || item.solutionLink))
	);
}

function isConceptLessonItem(item: RawCourseModuleItem) {
	return !isProjectLikeItem(item) && !isInformationalResourceItem(item);
}

const genericSupportItemTitlePattern =
	/^(?:Core Concepts|Concept Path|Design and Planning Map|Debugging and Test Pass|Share and Explain|Extension Project|Guided Example|Worked Example|Core Project|Review and Reflection|Extension Challenge|Build Requirements|Common Bug Patterns|Application Check|Verification and Reflection|Checkpoint: .+|Supplemental Project \d+)$/i;

function compactWhitespace(text: string) {
	return text.replace(/\s+/g, " ").trim();
}

function preservesBlockStructure(text: string) {
	return /(?:^|\n)\s*(?:[-*]|\d+\.)\s+\S/.test(text);
}

function hasMarkdownSupportLabel(text: string) {
	return /\*\*[^*\n]{2,80}:\*\*/.test(text);
}

function supportBaseContent(text: string) {
	if (!preservesBlockStructure(text)) return compactWhitespace(text);

	return text.replace(/\n{3,}/g, "\n\n").trim();
}

function stripLessonTitlePrefix(title: string) {
	return compactWhitespace(title)
		.replace(
			/^(?:Course Setup|Lesson|Guided Practice|Data Practice|Data Mini Lesson|Sensemaking Discussion|Case Study|Simulation Practice|Readiness Check):\s*/i,
			""
		)
		.replace(/:+$/g, "");
}

function compactAppliedLabTitle(title: string) {
	return stripLessonTitlePrefix(title)
		.replace(/\b(?:Applied|Implementation) (?:Lab|Studio):\s*/i, "")
		.replace(/:\s*(?:(?:Applied|Implementation) Lab|Applied Studio)$/i, "")
		.trim();
}

function cleanAppliedLabDisplayTitle(title: string) {
	return title
		.replace(/\bPattern Applied Lab\b/g, "Pattern Lab")
		.replace(/:\s*Applied Lab$/i, "")
		.replace(/\s+Applied Lab$/i, "")
		.replace(/:\s*Applied Studio$/i, "")
		.replace(/\s+Applied Studio$/i, "")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function cleanAppliedLabReferenceText(text: string) {
	return text
		.replace(/\bPattern Applied Lab\b/g, "Pattern Lab")
		.replace(/(\*\*[^*\n]{1,160}?): Applied Lab(\*\*)/g, "$1$2");
}

function neutralizeLessonPointText(text: string) {
	const hasSupportLabel = hasMarkdownSupportLabel(text);
	const source =
		preservesBlockStructure(text) || hasSupportLabel
			? formatVisibleMarkdownStructure(text)
			: compactWhitespace(text);

	return source
		.replace(/^Set expectations for\b/i, "This section establishes")
		.replace(/^Teach students to\b/i, "This section develops how to")
		.replace(/^Show students\b/i, "This section shows")
		.replace(/^Introduce\b/i, "This section introduces")
		.replace(/^Teach\b/i, "This section develops")
		.replace(/^Cover\b/i, "This section includes")
		.replace(/^Review\b/i, "This section reviews")
		.replace(/^Use\b/i, "This section uses")
		.replace(/^Practice\b/i, "This section practices")
		.replace(/^Build\b/i, "This section builds")
		.replace(/^Explain\b/i, "This section explains")
		.replace(/\bthen ask what\b/gi, "then examines what")
		.replace(/\bthen ask\b/gi, "then examines")
		.replace(
			/\bOptional observations may be assigned\b/gi,
			"Optional observations are included"
		)
		.replace(/\bHave students ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bhave students ([a-z])/g, keepMatchedFirstLetter);
}

function formatLessonArcPointContent(content: string) {
	const formatted = neutralizeLessonPointText(content);
	if (
		preservesBlockStructure(formatted) ||
		hasMarkdownSupportLabel(formatted) ||
		compactWhitespace(formatted).length < 650
	) {
		return formatted;
	}

	const sentences = splitSentenceList(compactWhitespace(formatted));
	if (sentences.length < 5) return formatted;

	const [keyIdea, ...details] = sentences;

	return [
		`**Main idea:** ${keyIdea}`,
		`**Details:**\n${details.map(detail => `- ${detail}`).join("\n")}`
	].join("\n\n");
}

function lessonArcContent(items: RawCourseModuleItem[]) {
	const points = items.map((item, index) => {
		const title = stripLessonTitlePrefix(item.title);
		const content = formatLessonArcPointContent(item.content);
		const indentedContent = content
			.split("\n")
			.map(line => (line.trim() ? `   ${line}` : ""))
			.join("\n");

		return `${index + 1}. **${title}**\n${indentedContent}`;
	});

	return ["Core topics in this module:", "", points.join("\n\n")].join("\n");
}

function briefConceptAddendum(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	const seed = `${module.title}|${item.title}`;
	const title = compactWhitespace(stripLessonTitlePrefix(item.title));
	const topic = title || "this concept";
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return [
		`**Concept focus:** ${topic} begins with the vocabulary for one concrete example, then changes one condition to test transfer.`,
		`**Concept focus:** ${topic} pairs a worked example with a changed condition so the reasoning can be checked, not memorized.`,
		`**Concept focus:** ${topic} links vocabulary to evidence by naming what happens in a concrete case and what changes in a second case.`,
		`**Concept focus:** ${topic} links definitions to practice by naming the idea, tracing one example, and checking a changed condition.`
	][hash % 4];
}

function enrichBriefConceptLesson(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	if (compactWhitespace(item.content).length >= 220) return item;

	return {
		...item,
		content: `${compactWhitespace(item.content)} ${briefConceptAddendum(module, item)}`
	};
}

function hasAttachedResource(item: RawCourseModuleItem) {
	return Boolean(
		item.projectLink ||
		item.solutionLink ||
		item.datasetLink ||
		item.mediaLink
	);
}

function conceptGroupTitle(
	course: RawCourse,
	module: RawCourseModule,
	label: "Core Concepts" | "Application Check"
) {
	const focus = compactContextualTitleFocus(
		course.name,
		module.title,
		module.title
	);

	return `${focus} ${label}`;
}

function groupConceptLessons(
	course: RawCourse,
	module: RawCourseModule,
	items: RawCourseModuleItem[]
) {
	if (items.length <= 4) {
		return [
			{
				title: conceptGroupTitle(course, module, "Core Concepts"),
				content: lessonArcContent(items)
			}
		];
	}

	const midpoint = Math.ceil(items.length / 2);
	return [
		{
			title: conceptGroupTitle(course, module, "Core Concepts"),
			content: lessonArcContent(items.slice(0, midpoint))
		},
		{
			title: conceptGroupTitle(course, module, "Application Check"),
			content: lessonArcContent(items.slice(midpoint))
		}
	];
}

function normalizeModuleLessonShape(course: RawCourse) {
	for (const module of course.modules) {
		const conceptItems = module.curriculum.filter(item =>
			isConceptLessonItem(item)
		);

		if (conceptItems.length === 0) continue;

		if (conceptItems.length <= 2) {
			module.curriculum = module.curriculum.map(item =>
				!isConceptLessonItem(item)
					? item
					: enrichBriefConceptLesson(module, item)
			);
			continue;
		}

		if (conceptItems.some(hasAttachedResource)) {
			module.curriculum = module.curriculum.map(item =>
				!isConceptLessonItem(item)
					? item
					: enrichBriefConceptLesson(module, item)
			);
			continue;
		}

		const groupedConcepts = groupConceptLessons(
			course,
			module,
			conceptItems
		);
		const nextCurriculum: RawCourseModuleItem[] = [];
		let insertedConceptGroup = false;

		for (const item of module.curriculum) {
			if (!isConceptLessonItem(item)) {
				nextCurriculum.push(item);
				continue;
			}

			if (!insertedConceptGroup) {
				nextCurriculum.push(...groupedConcepts);
				insertedConceptGroup = true;
			}
		}

		module.curriculum = nextCurriculum;
	}
}

type CourseTextSection = "curriculum" | "supplementalProjects";

interface CourseTextContext {
	courseId: string;
	course: RawCourse;
	module: RawCourseModule;
	item: RawCourseModuleItem;
	section: CourseTextSection;
}

const structuredSupportPattern =
	/\*\*(?:Goal|Project goal|Teaching flow|Concept path|Learning sequence|Diagnostic guidance|Readiness check|Misconception check|Common pitfalls|Failure modes|Common failure modes|Exit check|Mastery check|Investigation|Remote investigation|Explanation|Science explanation|Studio focus|Evidence target|Evidence targets|AP connection):?\*\*/i;
const projectReviewSupportPattern =
	/\*\*(?:Outcome|Required outcome|Success criteria|Completion checks|Checkpoints|Extension):\*\*/i;
const visibleLessonBackbonePattern =
	/\*\*(?:Applied studio|Build path|Concept focus|Concept path|Course path|Evidence of proficiency|Evidence target|Evidence targets|Explanation|Focus|Goal|Investigation|Project selection|Project target|Readiness check|Readiness map|Result|Science explanation|Scope path|Selected checks|Studio focus):\*\*|Core topics in this module:|Representative solutions/i;

const placeholderContentPattern =
	/\b(?:introduce the main goal|build the central artifact|define the success criteria|use the .* snapshot|alternate supplemental snapshot)\b/i;
const scienceEvidencePattern =
	/\b(?:CER|claim[-, ]+evidence(?:[-, ]+and)?[-, ]+reasoning)\b/i;

function wordCount(text: string) {
	const words = compactWhitespace(text).match(/\b[\w'+-]+\b/g);
	return words ? words.length : 0;
}

function capitalizeFirstLetter(value: string) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

function thirdPersonVerb(value: string) {
	const lower = value.toLowerCase();
	const irregular: Record<string, string> = {
		be: "is",
		do: "does",
		have: "has"
	};

	if (irregular[lower]) return irregular[lower];
	if (/(?:[sxzo]|sh|ch)$/i.test(lower)) return `${lower}es`;
	if (/[^aeiou]y$/i.test(lower)) return `${lower.slice(0, -1)}ies`;
	return `${lower}s`;
}

function gerundToBaseVerb(value: string) {
	const lower = value.toLowerCase();
	const commonGerunds: Record<string, string> = {
		analyzing: "analyze",
		building: "build",
		combining: "combine",
		connecting: "connect",
		creating: "create",
		diagnosing: "diagnose",
		mapping: "map",
		modeling: "model",
		organizing: "organize",
		reviewing: "review",
		turning: "turn",
		using: "use"
	};

	if (commonGerunds[lower]) return commonGerunds[lower];
	if (lower.endsWith("ying")) return `${lower.slice(0, -4)}y`;
	if (lower.endsWith("ing")) return lower.slice(0, -3);
	return lower;
}

function moduleFocusVerbReplacement(_match: string, verb: string) {
	return `This module ${thirdPersonVerb(gerundToBaseVerb(verb))}`;
}

function neutralizeCourseShouldPhrasing(text: string) {
	return text
		.replace(
			/\bcourse should (?:(already|now|repeatedly)\s+)?([A-Za-z]+)\b/g,
			(_match, adverb: string | undefined, verb: string) => {
				const normalizedAdverb = adverb
					? `${adverb.toLowerCase()} `
					: "";
				return `course ${normalizedAdverb}${thirdPersonVerb(verb)}`;
			}
		)
		.replace(
			/\bEach checkpoint should answer three questions\b/g,
			"Each checkpoint answers three questions"
		)
		.replace(
			/\bA missing resource in ([^.\n]+?) is not automatically a blocker, but it should be classified\b/g,
			"A missing resource in $1 is not automatically a blocker; it is classified"
		)
		.replace(
			/\bThe evidence should point to the resource used, and the reasoning should explain\b/g,
			"The evidence points to the resource used, and the reasoning explains"
		)
		.replace(/\bA fallback should preserve\b/g, "A fallback preserves")
		.replace(/\bThe notes should identify\b/g, "The notes identify")
		.replace(
			/\bReusable ([^.\n]+?) projects should include enough setup notes\b/g,
			"Reusable $1 projects include enough setup notes"
		)
		.replace(
			/\bThe setup should not silently rely\b/g,
			"The setup does not silently rely"
		)
		.replace(/\bThe habit should be\b/g, "The habit is")
		.replace(
			/\bRecord the invariant that should remain true\b/g,
			"Record the invariant that remains true"
		)
		.replace(
			/\binvariant that should stay true\b/g,
			"invariant that stays true"
		)
		.replace(/\bThe example should be\b/g, "The example is")
		.replace(
			/\bThe later project should reuse\b/g,
			"The later project reuses"
		)
		.replace(
			/\bIt should separate observed evidence from inferred risk\b/g,
			"The review separates observed evidence from inferred risk"
		)
		.replace(
			/\bIt should distinguish reachability, impact, mitigation, and remaining uncertainty\b/g,
			"The review distinguishes reachability, impact, mitigation, and remaining uncertainty"
		)
		.replace(
			/\b(Data Science|AI Foundations|Machine Learning) artifacts should preserve\b/g,
			"$1 artifacts preserve"
		)
		.replace(
			/\bManual-memory work should include\b/g,
			"Manual-memory work includes"
		)
		.replace(
			/\bBranch placement should be based\b/g,
			"Branch placement is based"
		)
		.replace(
			/\bThe harness should reduce ambiguity\b/g,
			"The harness reduces ambiguity"
		)
		.replace(/\bThe review should identify\b/g, "The review identifies")
		.replace(/\bThe label should make\b/g, "The label makes")
		.replace(/\bThe formats should not be\b/g, "The formats are not")
		.replace(/\bThe blueprint should make\b/g, "The blueprint makes")
		.replace(/\bEvery dataset should have\b/g, "Every dataset has")
		.replace(/\bThe card should make\b/g, "The card makes")
		.replace(/\bThe card should connect\b/g, "The card connects")
		.replace(/\bThe report should explain\b/g, "The report explains")
		.replace(/\bEach example should include\b/g, "Each example includes")
		.replace(/\bThe build should preserve\b/g, "The build preserves")
		.replace(/\bEach level should have\b/g, "Each level has")
		.replace(
			/\bMulti-file assignments should use\b/g,
			"Multi-file assignments use"
		)
		.replace(/\bDS&A should follow\b/g, "DS&A follows")
		.replace(
			/\bC Systems, Assembly, Design Patterns, and Low-Level Security should assume\b/g,
			"C Systems, Assembly, Design Patterns, and Low-Level Security assume"
		)
		.replace(/\bThe generated graph\b/g, "The provided graph")
		.replace(/\bThe generated graphic\b/g, "The provided graphic")
		.replace(/\bThe generated reference\b/g, "The provided reference")
		.replace(
			/\bThe generated sequence graphic\b/g,
			"The provided sequence graphic"
		)
		.replace(
			/\bThe generated unit-circle graphic\b/g,
			"The provided unit-circle graphic"
		)
		.replace(/\bThe generated graph pack\b/g, "The provided graph pack")
		.replace(
			/\bthe generated rational\/piecewise references\b/g,
			"the provided rational/piecewise references"
		)
		.replace(/\bthe generated graph pack\b/g, "the provided graph pack")
		.replace(/\bUse the generated\b/g, "Use the provided")
		.replace(/\bReuse the generated\b/g, "Reuse the provided");
}

function indefiniteArticleFor(value: string) {
	return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

function capitalizeMatchedFirstLetter(_match: string, first: string) {
	return capitalizeFirstLetter(first);
}

function keepMatchedFirstLetter(_match: string, first: string) {
	return first;
}

function beforeStartingMatchedFirstLetter(_match: string, first: string) {
	return `Before starting, ${first}`;
}

function beforeMatchedFirstLetter(_match: string, first: string) {
	return `before ${first}`;
}

function toMatchedFirstLetter(_match: string, first: string) {
	return `to ${first}`;
}

function workCanMatchedFirstLetter(_match: string, first: string) {
	return `the work can ${first}`;
}

function taskRequiresMatchedFirstLetter(_match: string, first: string) {
	return `the task requires ${first}`;
}

function enoughToMatchedFirstLetter(_match: string, first: string) {
	return `enough to ${first}`;
}

function repeatedlyMatchedFirstLetter(_match: string, first: string) {
	return `Repeatedly ${first}`;
}

function lowercaseRepeatedlyMatchedFirstLetter(_match: string, first: string) {
	return `repeatedly ${first}`;
}

function stripTrailingSentencePunctuation(value: string) {
	return value.trim().replace(/[.!?]+$/g, "");
}

function formatInlineNumberedLists(text: string) {
	const markerPattern = /(^|\n|[^\S\n])(\d{1,2})\.\s+(?=(?:\*\*)?[A-Z"`])/g;
	const markers: {
		number: number;
		start: number;
	}[] = [];

	for (const match of text.matchAll(markerPattern)) {
		const start = (match.index ?? 0) + match[1].length;
		const previous =
			match[1] && !match[1].includes("\n") && (match.index ?? 0) > 0
				? text[(match.index ?? 0) - 1]
				: start > 0
					? text[start - 1]
					: "";

		if (/\w/.test(previous)) continue;

		markers.push({
			number: Number(match[2]),
			start
		});
	}

	const splitStarts = new Map<number, number>();

	for (let index = 0; index < markers.length; index++) {
		const marker = markers[index];

		if (marker.number !== 1) continue;

		const sequence = [marker];
		let expected = 2;

		for (
			let nextIndex = index + 1;
			nextIndex < markers.length;
			nextIndex++
		) {
			const next = markers[nextIndex];

			if (next.number === expected) {
				sequence.push(next);
				expected++;
				continue;
			}

			break;
		}

		if (sequence.length < 2) continue;

		for (const item of sequence) {
			splitStarts.set(item.start, item.number);
		}
	}

	if (splitStarts.size === 0) return text;

	let result = "";
	let cursor = 0;

	for (const start of [...splitStarts.keys()].sort((a, b) => a - b)) {
		const markerNumber = splitStarts.get(start) ?? 1;
		result += text.slice(cursor, start).replace(/[ \t]+$/g, "");

		if (result && markerNumber === 1 && !result.endsWith("\n\n")) {
			result += result.endsWith("\n") ? "\n" : "\n\n";
		} else if (result && !result.endsWith("\n")) {
			result += "\n";
		}

		cursor = start;
	}

	return `${result}${text.slice(cursor)}`;
}

const supportLabelPattern = [
	"Focus",
	"Goal",
	"Outcome",
	"Expected outcome",
	"Verification focus",
	"Readable output",
	"Result quality",
	"Project focus",
	"Project goal",
	"Planning targets",
	"Implementation options",
	"Required outcome",
	"Include",
	"Required fields",
	"Notes",
	"Required notes",
	"Details",
	"Steps",
	"Work sequence",
	"Build plan",
	"Build steps",
	"Build sequence",
	"What to show",
	"Checkpoint",
	"Checkpoint goal",
	"Checkpoints",
	"Completion checks",
	"Evidence target",
	"Evidence targets",
	"Extension",
	"Concept path",
	"Core topics",
	"Design checkpoint",
	"Decision checkpoint",
	"Common pitfalls",
	"Common failure modes",
	"Failure modes",
	"Mastery check",
	"Evidence",
	"Readiness evidence",
	"Readiness",
	"Readiness target",
	"Readiness check",
	"Evidence of proficiency",
	"Java-specific goals",
	"Safety checkpoint",
	"Review target",
	"Scope boundary",
	"Course boundary",
	"Boundary",
	"Boundary check",
	"If this is difficult",
	"Investigation",
	"Remote investigation",
	"Explanation",
	"Science explanation",
	"Tasks",
	"Source set",
	"Activity prompt",
	"Analysis target",
	"Mastery evidence",
	"Revision trigger",
	"Output",
	"Practice check",
	"Evidence pattern",
	"Main idea",
	"Skill focus",
	"Practice targets",
	"Practice target",
	"Visible pattern",
	"Key idea",
	"Skill target",
	"Reference purpose",
	"Resource bank",
	"Reference links",
	"Use"
].join("|");

function formatSupportLabels(text: string) {
	const supportLabelRegex = `\\*\\*(?:${supportLabelPattern}):\\*\\*`;

	return text
		.replace(
			new RegExp(`(\\S)[ \\t]+(${supportLabelRegex})`, "g"),
			(_match, prefix: string, label: string, offset: number) => {
				const lineStart = text.lastIndexOf("\n", offset) + 1;
				const indentation =
					text.slice(lineStart, offset).match(/^[ \t]*/)?.[0] ?? "";

				return `${prefix}\n\n${indentation}${label}`;
			}
		)
		.replace(
			new RegExp(`(?<!\\n)\\n([ \\t]*${supportLabelRegex})`, "g"),
			"\n\n$1"
		);
}

function normalizeSupportLabelText(text: string) {
	return text
		.replace(/\*\*Project goal:\*\*/gi, "**Goal:**")
		.replace(/\*\*Practice targets:\*\*/gi, "**Practice checks:**")
		.replace(/\*\*Practice target:\*\*/gi, "**Practice check:**")
		.replace(/\bPractice targets:/gi, "Practice checks:")
		.replace(/\bPractice target:/gi, "Practice check:")
		.replace(/\bPractice targets\b/g, "Practice checks")
		.replace(/\bPractice target\b/g, "Practice check")
		.replace(/\bpractice targets\b/g, "practice checks")
		.replace(/\bpractice target\b/g, "practice check")
		.replace(/\*\*Required outcome:\*\*/gi, "**Outcome:**")
		.replace(/\*\*Required fields:\*\*/gi, "**Include:**")
		.replace(/\*\*Required notes:\*\*/gi, "**Notes:**")
		.replace(/\*\*Required elements:\*\*/gi, "**Include:**")
		.replace(/\*\*Required work:\*\*/gi, "**Core work:**")
		.replace(/\*\*Required gate artifact:\*\*/gi, "**Capstone brief:**")
		.replace(/\*\*Path:\*\*/gi, "**Approach:**")
		.replace(/\*\*Build path:\*\*/gi, "**Build plan:**")
		.replace(/\*\*Work sequence:\*\*/gi, "**Steps:**")
		.replace(/\*\*Implementation steps:\*\*/gi, "**Steps:**")
		.replace(/\*\*Success criteria:\*\*/gi, "**Success:**")
		.replace(/\*\*Build sequence:\*\*/gi, "**Build steps:**")
		.replace(/\*\*Completion checks:\*\*/gi, "**Checkpoints:**")
		.replace(/\*\*Mastery check:\*\*/gi, "**Evidence:**")
		.replace(/\*\*Readiness evidence:\*\*/gi, "**Readiness:**")
		.replace(/\*\*Evidence target:\*\*/gi, "**What to show:**")
		.replace(/\*\*Evidence targets:\*\*/gi, "**What to show:**")
		.replace(/\*\*Readiness check:\*\*/gi, "**Quick check:**")
		.replace(
			/\*\*Evidence of proficiency:\*\*/gi,
			"**What mastery looks like:**"
		)
		.replace(/\*\*Assessment ideas:\*\*/gi, "**Practice checks:**")
		.replace(/\*\*Rubric use:\*\*/gi, "**Review focus:**")
		.replace(/\*\*Rubric dimensions:\*\*/gi, "**Review criteria:**")
		.replace(/\*\*Variant focus:\*\*/gi, "**Variant:**")
		.replace(/\*\*Applied lab:\*\*/gi, "**Lab:**")
		.replace(/\*\*Applied studio:\*\*/gi, "**Studio:**")
		.replace(/\*\*Project target:\*\*/gi, "**Project focus:**")
		.replace(/\*\*Alignment test:\*\*/gi, "**Alignment check:**")
		.replace(/\*\*Boundary rule:\*\*/gi, "**Boundary:**")
		.replace(/\*\*Gate guidance:\*\*/gi, "**Capstone check:**")
		.replace(/\*\*Check guidance:\*\*/gi, "**Check focus:**")
		.replace(/\*\*Current course use:\*\*/gi, "**Course use:**")
		.replace(/\*\*Current course emphasis:\*\*/gi, "**Course focus:**")
		.replace(/\*\*Current course boundary:\*\*/gi, "**Course boundary:**")
		.replace(/\*\*Course-specific labels:\*\*/gi, "**Course labels:**")
		.replace(
			/\*\*Original prompt restored:\*\*/gi,
			"**Original activity:**"
		)
		.replace(/\*\*Remote-safe activity:\*\*/gi, "**Remote activity:**")
		.replace(/\*\*Remote investigation:\*\*/gi, "**Investigation:**")
		.replace(/\*\*Science explanation:\*\*/gi, "**Explanation:**");
}

const generatedReferencePattern = [
	"activity",
	"project",
	"response",
	"work",
	"analysis",
	"program",
	"practice set",
	"checkpoint",
	"solution",
	"page",
	"lab",
	"system check",
	"AP Java task",
	"AP-style exercise",
	"Java checkpoint",
	"traced solution",
	"practice task",
	"Java implementation",
	"Java exercise",
	"class model",
	"class exercise",
	"code checkpoint",
	"object-design task",
	"object-design exercise",
	"practice build",
	"type-model task",
	"method-contract exercise",
	"method-contract checkpoint",
	"API checkpoint",
	"object-state build",
	"collection exercise",
	"data-structure exercise",
	"Java design task",
	"design checkpoint",
	"systems artifact",
	"command-line build",
	"runtime check",
	"diagnostic run",
	"runtime trace",
	"memory trace",
	"tooling check",
	"low-level implementation"
].join("|");

function normalizeSentenceStartReferences(text: string) {
	return text.replace(
		new RegExp(
			`([.!?]\\s+)(the (?:${generatedReferencePattern})\\b)`,
			"gi"
		),
		(_match, prefix: string, reference: string) =>
			`${prefix}${capitalizeSentence(reference)}`
	);
}

function normalizeRepeatedReferenceNouns(text: string) {
	return text.replace(
		new RegExp(
			`\\b(A complete|The final|Final) the (?:${generatedReferencePattern}) (result|note|response|answer|explanation|work)\\b`,
			"gi"
		),
		(_match, prefix: string, noun: string) => `${prefix} ${noun}`
	);
}

function polishVisibleGeneratedText(text: string) {
	return normalizeRepeatedReferenceNouns(
		normalizeSentenceStartReferences(text)
			.replace(/\bFor For Loops\b/g, "For loops")
			.replace(
				/\bfor For Loop Practice\b/g,
				"for the For Loop Practice project"
			)
			.replace(
				/\b([A-Z][A-Za-z0-9:,'& -]+ App) app path\b/g,
				"$1 application path"
			)
	);
}

function formatNamedCheckpointPrompts(text: string) {
	return text
		.replace(/\n([a-z][a-z ]*-\d+(?:,\d+)*:)\s*/gi, "\n\n- **$1** ")
		.replace(/\nNote:\s*/g, "\n\n**Note:** ");
}

const useThisOpeningVerbMap: Record<string, string> = {
	compare: "compares",
	drill: "drills",
	force: "forces",
	highlight: "highlights",
	reinforce: "reinforces",
	revisit: "revisits",
	review: "reviews",
	sharpen: "sharpens",
	tighten: "tightens"
};

function neutralizeUseThisOpening(text: string) {
	return text
		.replace(
			/(^|\n)Use this (check-in|checkpoint|module|review module|review|final check-in|project) as a ([^.]+)\./gi,
			(_match, prefix: string, subject: string, description: string) =>
				`${prefix}This ${subject.toLowerCase()} is a ${description}.`
		)
		.replace(
			/(^|\n)Use this (check-in|checkpoint|module|review module|review|final check-in|reference build|reference|project|build|one-line boolean exercise|supplemental build) to (compare|drill|force|highlight|reinforce|revisit|review|sharpen|tighten) ([^.]+)\./gi,
			(
				_match,
				prefix: string,
				subject: string,
				verb: string,
				detail: string
			) =>
				`${prefix}This ${subject.toLowerCase()} ${useThisOpeningVerbMap[verb.toLowerCase()]} ${detail}.`
		)
		.replace(
			/(^|\n)Use this (checklist|checkpoint) when ([^.]+)\./gi,
			(_match, prefix: string, subject: string, detail: string) =>
				`${prefix}This ${subject.toLowerCase()} supports ${detail}.`
		)
		.replace(
			/(^|\n)Use this (checkpoint|project|build|reference|supplemental build) for ([^.]+)\./gi,
			(_match, prefix: string, subject: string, detail: string) =>
				`${prefix}This ${subject.toLowerCase()} focuses on ${detail}.`
		)
		.replace(
			/(^|\n)Use this (checkpoint|reference|project|build|supplemental build) when ([^.]+)\./gi,
			(_match, prefix: string, subject: string, detail: string) =>
				`${prefix}This ${subject.toLowerCase()} is a reference point when ${detail}.`
		)
		.replace(/\brather than as a\b/g, "rather than a");
}

const coreTopicStudioBlockStartPattern =
	/^\s+\*\*(?:Applied lab|Applied studio|Lab|Studio):\*\*/i;

function collapseRepeatedStudioSupportInCoreTopics(text: string) {
	if (!text.includes("Core topics in this module:")) return text;

	const [header, ...bodyParts] = text.split(/\n\n/);
	const body = bodyParts.join("\n\n");
	if (!body.trim()) return text;

	const chunks = body.split(/\n\n(?=\d+\.\s+\*\*)/);
	let supportBlock = "";
	let supportCount = 0;
	const collapsedChunks = chunks.map(chunk => {
		const lines = chunk.split("\n");
		const supportStart = lines.findIndex(line =>
			coreTopicStudioBlockStartPattern.test(line)
		);
		if (supportStart < 0) return chunk;

		supportCount += 1;
		if (!supportBlock) {
			supportBlock = lines
				.slice(supportStart)
				.map(line => line.replace(/^ {3}/, ""))
				.join("\n")
				.trim();
		}

		return lines.slice(0, supportStart).join("\n").trimEnd();
	});

	if (supportCount < 2 || !supportBlock) return text;

	return [
		header,
		collapsedChunks.join("\n\n").trim(),
		`**Studio practice:**\n\n${supportBlock}`
	]
		.filter(Boolean)
		.join("\n\n");
}

function formatVisibleMarkdownStructure(text: string) {
	const formatted = formatNamedCheckpointPrompts(
		formatSupportLabels(
			formatInlineNumberedLists(neutralizeUseThisOpening(text))
		)
	);

	if (!formatted.includes("Core topics in this module:")) {
		return polishVisibleGeneratedText(formatted);
	}

	const collapsed = collapseRepeatedStudioSupportInCoreTopics(formatted);

	return polishVisibleGeneratedText(
		collapsed.replace(
			/\n\n(\*\*(?:Practice check|Evidence pattern|Main idea|Skill focus):\*\*)/g,
			"\n\n   $1"
		)
	);
}

function listifyInlineTopics(value: string) {
	const normalized = stripTrailingSentencePunctuation(value)
		.replace(/;\s*/g, ", ")
		.replace(/,\s+and\s+/g, ", ")
		.replace(/\s+and\s+why\s+/g, ", why ")
		.replace(/\s+and\s+how\s+/g, ", how ");
	const topics = normalized
		.split(/,\s+/)
		.map(topic => stripTrailingSentencePunctuation(topic))
		.filter(Boolean);

	if (topics.length < 3) {
		return `**Key topics:** ${normalized}.`;
	}

	return `**Key topics:**\n${topics.map(topic => `- ${topic}`).join("\n")}`;
}

function lessonOpening(label: string, description: string, topics: string) {
	const normalizedDescription =
		label === "This lesson begins with"
			? stripTrailingSentencePunctuation(description).replace(
					/\band make\b/g,
					"and makes"
				)
			: stripTrailingSentencePunctuation(description);

	return [
		`${label} ${normalizedDescription}.`,
		listifyInlineTopics(topics)
	].join("\n\n");
}

function supportLabelParagraph(
	label: string,
	leadingWhitespace: string,
	body: string,
	sourceText: string,
	matchOffset: number
) {
	const readerLabel =
		{
			"Practice target": "Practice check",
			"Practice targets": "Practice checks",
			"Visible pattern": "Evidence pattern",
			"Key idea": "Main idea",
			"Skill target": "Skill focus"
		}[label] ?? label;
	const lineStart = sourceText.lastIndexOf("\n", matchOffset) + 1;
	const linePrefix = sourceText.slice(lineStart, matchOffset);
	const indentation =
		linePrefix && /^[ \t]*$/.test(linePrefix)
			? linePrefix
			: leadingWhitespace.includes("\n")
				? (leadingWhitespace.match(/(?:^|\n)([ \t]*)$/)?.[1] ?? "")
				: "";

	return `\n\n${indentation}**${readerLabel}:** ${capitalizeFirstLetter(stripTrailingSentencePunctuation(body))}.`;
}

function neutralizeLessonDirectiveText(text: string) {
	return text
		.replace(
			/\bRepeat the core ideas from ([^.]+) on a smaller problem to build speed, independence, and cleaner reasoning\./g,
			(_match, topic) =>
				`Focused drill for ${stripTrailingSentencePunctuation(topic)}: rebuild the central behavior in a smaller scene, then test one normal run and one boundary or restart case.`
		)
		.replace(
			/\bCreate an original variation inspired by ([^.]+)\. Keep the scope small, but require one meaningful design or reasoning choice\./g,
			(_match, topic) =>
				`Original variant for ${stripTrailingSentencePunctuation(topic)}: change the theme, control rule, score condition, or feedback cue while keeping the core Scratch idea visible.`
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Teach students to\b/g,
			"$1This lesson develops how to"
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Teach\b/g, "$1This lesson develops")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Introduce\b/g,
			"$1This section introduces"
		)
		.replace(/(^|\n\s*|:\s+)Cover\b/g, "$1This section includes")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Set expectations for\b/g,
			"$1This section establishes"
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Set expectations\b/g,
			"$1Clear expectations are established"
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Explain that ([a-z])/g,
			(_match, prefix, first) =>
				`${prefix}${capitalizeFirstLetter(first)}`
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Explain that (?=["“`])/g, "$1")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Discuss real-life examples of ([^.]+)\./g,
			"$1Real-life examples of $2 connect the idea to familiar situations."
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Discuss how\b/g, "$1Analyze how")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Discuss customizing ([^.]+)\./g,
			"$1Practice customizing $2."
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Show the ([^.]+)\./g, "$1Use the $2.")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Demonstrate how\b/g, "$1Practice how")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Practice how to ([a-z])/g,
			(_match, prefix, first) =>
				`${prefix}${capitalizeFirstLetter(first)}`
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Practice how ([a-z])/g,
			(_match, prefix, first) =>
				`${prefix}${capitalizeFirstLetter(first)}`
		)
		.replace(/\bPractice how to ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bPractice how ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bpractice how to ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\band demonstrate how\b/g, "and shows how")
		.replace(/\band demonstrate the\b/g, "and use the")
		.replace(/\bEmphasize the\b/g, "Notice the")
		.replace(/\bemphasize the\b/g, "notice the")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Emphasize that\b/g, "$1Note that")
		.replace(/\bThen discuss\b/g, "Then compare")
		.replace(
			/(^|\n\s*|[.!?]\s+)Start the course by\b/g,
			"$1The course begins by"
		)
		.replace(/(^|\n\s*|[.!?]\s+)Keep the setup\b/g, "$1The setup remains")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Ask whether\b/g, "$1Evaluate whether")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Ask what\b/g, "$1Analyze what")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Ask why\b/g, "$1Analyze why")
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Ask how\b/g, "$1Analyze how")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Guide learners to\b/g,
			"$1This section guides the process of"
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Show two or three models\b/g,
			"$1Compare two or three models"
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Show where\b/g, "$1Identify where")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Show the difference between\b/g,
			"$1Compare"
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Encourage projects that\b/g,
			"$1Strong projects"
		)
		.replace(
			/^Start with ([^.]+)\. Cover: ([^.]+)\./g,
			(_match, description, topics) =>
				lessonOpening("This lesson begins with", description, topics)
		)
		.replace(
			/^Teach ([^.]+)\. Cover: ([^.]+)\./g,
			(_match, description, topics) =>
				lessonOpening("This lesson develops", description, topics)
		)
		.replace(
			/^Introduce ([^.]+)\. Cover: ([^.]+)\./g,
			(_match, description, topics) =>
				lessonOpening("This lesson introduces", description, topics)
		)
		.replace(
			/^Review ([^.]+)\. Cover: ([^.]+)\./g,
			(_match, description, topics) =>
				lessonOpening("This lesson reviews", description, topics)
		)
		.replace(
			/^Position ([^.]+)\. Cover: ([^.]+)\./g,
			(_match, description, topics) =>
				lessonOpening("This section positions", description, topics)
		)
		.replace(/\bCover:\s*/g, "Key topics include ")
		.replace(
			/\bStart with vocabulary, work through one concrete example, predict the next step, and connect the example back to the project or practice task in this module\./gi,
			"Key terms, a worked example, and a transfer check form the core sequence for this module."
		)
		.replace(
			/(^|[.!?]\s+|:\s+|\n\s*(?:[-*]\s+)?)Start with ([^.]+)\./g,
			(_match, prefix, topic) =>
				`${prefix}Begin with ${stripTrailingSentencePunctuation(topic)}.`
		)
		.replace(
			/(^|[.!?]\s+|:\s+|\n\s*(?:[-*]\s+)?)start with ([^.]+)\./g,
			(_match, prefix, topic) =>
				`${prefix}begin with ${stripTrailingSentencePunctuation(topic)}.`
		)
		.replace(
			/\bfresh the starting point is ([^.]+)\./g,
			(_match, topic) =>
				`rerun cleanly with ${stripTrailingSentencePunctuation(topic)}.`
		)
		.replace(
			/\bFresh the starting point is ([^.]+)\./g,
			(_match, topic) =>
				`The starting point is ${stripTrailingSentencePunctuation(topic).replace(/\band get\b/g, "and getting")}.`
		)
		.replace(
			/\bstudents start with manageable organization\b/g,
			"project organization stays manageable"
		)
		.replace(
			/\blearners start with manageable organization\b/g,
			"project organization stays manageable"
		)
		.replace(/\bshould start with\b/g, "begins with")
		.replace(
			/\bdeployment bugs start with services not listening\b/g,
			"deployment bugs begin when services are not listening"
		)
		.replace(
			/\bWatch for the idea that\b/g,
			"A common misconception is that"
		)
		.replace(
			/\bwatch for the idea that\b/g,
			"a common misconception is that"
		)
		.replace(
			/\bWatch for likely mistakes such as\b/g,
			"Common failure modes include"
		)
		.replace(
			/\bwatch for likely mistakes such as\b/g,
			"common failure modes include"
		)
		.replace(/\bWatch for\b/g, "Common failure modes include")
		.replace(/\bwatch for\b/g, "common failure modes include")
		.replace(/\*\*Common pitfalls:\*\*/gi, "**Failure modes:**")
		.replace(/\bcommon pitfalls\b/g, "common failure modes")
		.replace(/\bCommon pitfalls\b/g, "Common failure modes")
		.replace(
			/\bFor ([^.,\n]{1,140}), check for\b/g,
			"For $1, failure modes include"
		)
		.replace(
			/\bFor ([^.,\n]{1,140}), check whether\b/g,
			"For $1, verification asks whether"
		)
		.replace(
			/\bIn ([^.,\n]{1,140}), check for\b/g,
			"In $1, failure modes include"
		)
		.replace(
			/\bStudents also often assume\b/g,
			"Another common assumption is that"
		)
		.replace(
			/\bstudents also often assume\b/g,
			"another common assumption is that"
		)
		.replace(/\bwithout copying the demonstration\b/gi, "independently")
		.replace(/\bwithout copying the wording\b/gi, "in original wording")
		.replace(/\bwithout copying code\b/gi, "without duplicating code")
		.replace(
			/\bwithout copying the ([a-z][^.]+?)\b/gi,
			"without duplicating the $1"
		)
		.replace(/\bHave learners trace\b/g, "Trace")
		.replace(/\bhave learners trace\b/g, "trace")
		.replace(/\bshow them how to\b/gi, "practice how to")
		.replace(/\bshow them how\b/gi, "practice")
		.replace(/\bguide them through\b/gi, "practice")
		.replace(/\bDo not require\b/g, "The activity does not require")
		.replace(/\bdo not require\b/g, "the activity does not require")
		.replace(/\bshould be optional\b/gi, "is optional")
		.replace(
			/\bcan be taught as optional enrichment\b/gi,
			"work as optional enrichment"
		)
		.replace(
			/(\s*)(?:\*\*)?\bPractice target:(?:\*\*)?([^\n.]+)\./g,
			(_match, leadingWhitespace, practice, offset, sourceText) =>
				supportLabelParagraph(
					"Practice target",
					leadingWhitespace,
					practice,
					sourceText,
					offset
				)
		)
		.replace(
			/(\s*)(?:\*\*)?\bPractice targets:(?:\*\*)?([^\n.]+)\./g,
			(_match, leadingWhitespace, practice, offset, sourceText) =>
				supportLabelParagraph(
					"Practice targets",
					leadingWhitespace,
					practice,
					sourceText,
					offset
				)
		)
		.replace(
			/(\s*)(?:\*\*)?\bVisible pattern:(?:\*\*)?([^\n.]+)\./g,
			(_match, leadingWhitespace, outcome, offset, sourceText) =>
				supportLabelParagraph(
					"Visible pattern",
					leadingWhitespace,
					outcome,
					sourceText,
					offset
				)
		)
		.replace(
			/(\s*)(?:\*\*)?\bKey idea:(?:\*\*)?([^\n.]+)\./g,
			(_match, leadingWhitespace, outcome, offset, sourceText) =>
				supportLabelParagraph(
					"Key idea",
					leadingWhitespace,
					outcome,
					sourceText,
					offset
				)
		)
		.replace(
			/(\s*)(?:\*\*)?\bSkill target:(?:\*\*)?([^\n.]+)\./g,
			(_match, leadingWhitespace, outcome, offset, sourceText) =>
				supportLabelParagraph(
					"Skill target",
					leadingWhitespace,
					outcome,
					sourceText,
					offset
				)
		);
}

function normalizeDuplicateArticles(text: string) {
	return text
		.replace(/\bthe\s+the\s+/gi, "the ")
		.replace(/\bThe\s+(The|A|An)\s+/g, "$1 ")
		.replace(/\bthe\s+(The|A|An)\s+/g, "$1 ")
		.replace(/\bA\s+(The|A|An)\s+/g, "$1 ")
		.replace(/\ba\s+(The|A|An)\s+/g, "$1 ")
		.replace(/\bAn\s+(The|A|An)\s+/g, "$1 ")
		.replace(/\ban\s+(The|A|An)\s+/g, "$1 ");
}

const sectionActionVerbs: Record<string, string> = {
	add: "adds",
	build: "builds",
	calculate: "calculates",
	choose: "chooses",
	compare: "compares",
	complete: "completes",
	compute: "computes",
	connect: "connects",
	consider: "considers",
	control: "controls",
	create: "creates",
	define: "defines",
	describe: "describes",
	discuss: "discusses",
	draw: "draws",
	explain: "explains",
	finish: "finishes",
	identify: "identifies",
	keep: "keeps",
	make: "makes",
	move: "moves",
	practice: "practices",
	record: "records",
	run: "runs",
	show: "shows",
	test: "tests",
	trace: "traces",
	use: "uses",
	verify: "verifies",
	write: "writes"
};

function sectionActionPattern(prefix: string) {
	return new RegExp(
		`${prefix}(${Object.keys(sectionActionVerbs).join("|")})\\b`,
		"gi"
	);
}

function normalizeSectionActionAgreement(text: string) {
	const commaPattern = sectionActionPattern("([,;]\\s+)");
	const commaAndPattern = sectionActionPattern("(,\\s+and\\s+)");
	const andPattern = sectionActionPattern("(\\s+and\\s+)");

	return text.replace(/\bThis section [^.]+\./g, sentence => {
		if (
			/\bThis section introduces each [^.]* topic in prerequisite order and tie it to\b/i.test(
				sentence
			)
		) {
			return sentence.replace(
				/\bThis section introduces each ([^.]*) topic in prerequisite order and tie it to\b/i,
				"Each $1 topic is introduced in prerequisite order and tied to"
			);
		}

		if (
			/\bThis section reviews what [^.]* and identify\b/i.test(sentence)
		) {
			return sentence.replace(
				/\bThis section reviews what ([^.]*) and identify\b/i,
				"This section reviews what $1 and identifies"
			);
		}

		if (
			/\bThis section explains what [^.]* is and identify\b/i.test(
				sentence
			)
		) {
			return sentence.replace(
				/\bThis section explains what ([^.]*) is and identify\b/i,
				"This section explains what $1 is and identifies"
			);
		}

		if (
			/\bThis section explains how [^,.]* works, when [^,.]* can be used, complete [^,.]*, and identify\b/i.test(
				sentence
			)
		) {
			return sentence.replace(
				/\bThis section explains how ([^,.]*) works, when ([^,.]*) can be used, complete ([^,.]*), and identify\b/i,
				"This section explains how $1 works, when $2 can be used, completes $3, and identifies"
			);
		}

		if (
			/\bThis section explains how [^,.]* work, compute [^,.]*, compare [^,.]*, and identify\b/i.test(
				sentence
			)
		) {
			return sentence.replace(
				/\bThis section explains how ([^,.]*) work, compute ([^,.]*), compare ([^,.]*), and identify\b/i,
				"This section explains how $1 work, computes $2, compares $3, and identifies"
			);
		}

		const firstComma = sentence.indexOf(",");
		const opening =
			firstComma >= 0 ? sentence.slice(0, firstComma) : sentence;
		if (/\b(?:how|to)\b/i.test(opening)) return sentence;

		return sentence
			.replace(/,\s+then\s+add\b/gi, ", then adds")
			.replace(commaAndPattern, (_match, prefix, verb: string) => {
				return `${prefix}${sectionActionVerbs[verb.toLowerCase()]}`;
			})
			.replace(commaPattern, (_match, prefix, verb: string) => {
				return `${prefix}${sectionActionVerbs[verb.toLowerCase()]}`;
			})
			.replace(andPattern, (_match, prefix, verb: string) => {
				return `${prefix}${sectionActionVerbs[verb.toLowerCase()]}`;
			});
	});
}

function neutralizeStudentFacingText(text: string) {
	const neutralized = normalizeDuplicateArticles(
		neutralizeCourseShouldPhrasing(
			neutralizeLessonDirectiveText(text)
				.replace(
					/\bCore Concepts and Teaching Flow\b/g,
					"Core Concepts"
				)
				.replace(/\*\*Teaching flow:\*\*/gi, "**Concept path:**")
				.replace(/\*\*Learning sequence:\*\*/gi, "**Concept path:**")
				.replace(/\*\*Use this section:\*\*/gi, "**Learning path:**")
				.replace(/\*\*Output:\*\*/gi, "**Result:**")
				.replace(/\*\*Requirements:\*\*/gi, "**Include:**")
				.replace(/\*\*Completion check:\*\*/gi, "**Checkpoint:**")
				.replace(/\*\*Mastery check:\*\*/gi, "**Evidence:**")
				.replace(/\*\*Readiness evidence:\*\*/gi, "**Readiness:**")
				.replace(
					/\bThe final artifact should name\b/g,
					"The final artifact names"
				)
				.replace(
					/\bthe final artifact should name\b/g,
					"the final artifact names"
				)
				.replace(
					/\bThe final answer should name\b/g,
					"A complete answer names"
				)
				.replace(
					/\bthe final answer should name\b/g,
					"a complete answer names"
				)
				.replace(
					/\bThe final answer should not rank\b/g,
					"A strong answer does not rank"
				)
				.replace(
					/\bfirst observable success criteria should be clear\b/g,
					"first observable success criteria are clear"
				)
				.replace(
					/\bA fast-track learner should still demonstrate\b/g,
					"Fast-track placement still requires"
				)
				.replace(
					/\bthe final answer should not rank\b/g,
					"a strong answer does not rank"
				)
				.replace(
					/\bThe page should explicitly label\b/g,
					"The page explicitly labels"
				)
				.replace(
					/\bthe page should explicitly label\b/g,
					"the page explicitly labels"
				)
				.replace(
					/(\*\*Concept path:\*\*\s+)Teach\b/g,
					"$1This section develops"
				)
				.replace(
					/(\*\*Concept path:\*\*\s+)Introduce\b/g,
					"$1This section introduces"
				)
				.replace(
					/(\*\*Concept path:\*\*\s+)Cover\b/g,
					"$1This section includes"
				)
				.replace(
					/(\*\*Concept path:\*\*\s+)Set expectations for\b/g,
					"$1This section establishes"
				)
				.replace(
					/(\*\*Concept path:\*\*\s+)Set expectations\b/g,
					"$1Clear expectations are established"
				)
				.replace(
					/\*\*Diagnostic guidance:\*\*/gi,
					"**Readiness check:**"
				)
				.replace(/\*\*Misconception check:\*\*/gi, "**Failure modes:**")
				.replace(/\*\*Exit check:\*\*/gi, "**Mastery check:**")
				.replace(
					/Use this as one guided lesson arc covering these sections in sequence:/gi,
					"Core topics in this module:"
				)
				.replace(
					/This lesson arc covers these sections in sequence:/gi,
					"Core topics in this module:"
				)
				.replace(
					/Treat this as an guided explanation of ([^.]+)\./gi,
					"This lesson introduces $1."
				)
				.replace(
					/\bTreat this module as\b/gi,
					"This module functions as"
				)
				.replace(
					/\bTreat this as the anchor for\b/gi,
					"This is the anchor for"
				)
				.replace(/\bTreat this as\b/gi, "This functions as")
				.replace(/\binstructor-provided\b/gi, "provided")
				.replace(/\binstructor-approved\b/gi, "approved")
				.replace(/\binstructor-authored\b/gi, "authored")
				.replace(/\binstructor references\b/gi, "internal references")
				.replace(/\bteacher-provided\b/gi, "provided")
				.replace(/\bteacher requirement\b/gi, "course requirement")
				.replace(
					/\bThis module focuses on ([a-z]+)\b/g,
					moduleFocusVerbReplacement
				)
				.replace(/\bThe lesson should\b/g, "The focus is to")
				.replace(/\bthe lesson should\b/g, "the focus is to")
				.replace(/\bThe work should make\b/g, "The work makes")
				.replace(/\bthe work should make\b/g, "the work makes")
				.replace(/\bThe project should make\b/g, "The project makes")
				.replace(/\bthe project should make\b/g, "the project makes")
				.replace(/\bThe output should make\b/g, "The output makes")
				.replace(/\bthe output should make\b/g, "the output makes")
				.replace(
					/\bThe representation should make\b/g,
					"The representation makes"
				)
				.replace(
					/\bthe representation should make\b/g,
					"the representation makes"
				)
				.replace(/\bThe page should make\b/g, "The page makes")
				.replace(/\bthe page should make\b/g, "the page makes")
				.replace(/\bThe code should make\b/g, "The code makes")
				.replace(/\bthe code should make\b/g, "the code makes")
				.replace(
					/\bshould make ([^.]{0,160}?) visible\b/g,
					"makes $1 visible"
				)
				.replace(
					/\bThe finished project should have\b/g,
					"The finished project has"
				)
				.replace(
					/\bthe finished project should have\b/g,
					"the finished project has"
				)
				.replace(
					/\bThe finished code should have\b/g,
					"The finished code has"
				)
				.replace(
					/\bthe finished code should have\b/g,
					"the finished code has"
				)
				.replace(/\bThe project should feel\b/g, "The project feels")
				.replace(/\bthe project should feel\b/g, "the project feels")
				.replace(/\bThis path should feel\b/g, "This path functions")
				.replace(/\bthis path should feel\b/g, "this path functions")
				.replace(/\bshould feel like\b/g, "functions as")
				.replace(/\bThe output should feel\b/g, "The output functions")
				.replace(/\bthe output should feel\b/g, "the output functions")
				.replace(/\bwork should emphasize\b/g, "work emphasizes")
				.replace(/\bWork should emphasize\b/g, "Work emphasizes")
				.replace(/\bstudent-facing course\b/gi, "visible course")
				.replace(/\bstudent-facing\b/gi, "visible")
				.replace(/\bStudents\b/g, "Learners")
				.replace(/\bstudents\b/g, "learners")
				.replace(/\bA student\b/g, "A learner")
				.replace(/\ba student\b/g, "a learner")
				.replace(
					/\bLearners Can See and Model\b/g,
					"Visible Systems and Models"
				)
				.replace(
					/\bthe tutor should know whether\b/gi,
					"the priority indicates whether"
				)
				.replace(
					/\bthe tutor should be able to\b/gi,
					"the course makes it possible to"
				)
				.replace(
					/\bThe tutor should be able to\b/g,
					"The course makes it possible to"
				)
				.replace(/\bA future tutor can\b/g, "A future reviewer can")
				.replace(/\bA tutor can\b/g, "The course makes it possible to")
				.replace(/\ba tutor can\b/g, "the course makes it possible to")
				.replace(/\btutor-ready\b/gi, "review-ready")
				.replace(/\btutor-visible\b/gi, "solution-visible")
				.replace(/\btutor notes\b/gi, "review notes")
				.replace(
					/\bso the tutor is not forced to improvise\b/gi,
					"so the materials are not improvised"
				)
				.replace(
					/\bBefore starting, have the student ([a-z])/g,
					beforeStartingMatchedFirstLetter
				)
				.replace(
					/\bHave the student ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(
					/\bHave students ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(
					/\bAsk the student to ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(
					/\bAsk students to ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\bAsk them to ([a-z])/g, capitalizeMatchedFirstLetter)
				.replace(/\bAsk them whether\b/g, "Evaluate whether")
				.replace(/\bAsk them where\b/g, "Identify where")
				.replace(/\bAsk them what\b/g, "Describe what")
				.replace(/\bAsk them why\b/g, "Explain why")
				.replace(/\bAsk what\b/g, "Analyze what")
				.replace(/\bAsk why\b/g, "Analyze why")
				.replace(/\bAsk how\b/g, "Analyze how")
				.replace(/\bAsk the student\b/g, "Consider")
				.replace(
					/\bIf the struggles with\b/g,
					"If this term is difficult,"
				)
				.replace(
					/\byou can have them visualize\b/g,
					"it may help to visualize"
				)
				.replace(/\bshow them how to\b/gi, "practice how to")
				.replace(/\bshow them how\b/gi, "practice")
				.replace(/\bguide them through\b/gi, "practice")
				.replace(/\bDiscuss with the why\b/g, "Explain why")
				.replace(/\bDiscuss with the about\b/g, "Discuss")
				.replace(/\bDiscuss with the\b/g, "Discuss")
				.replace(/\bHave click on\b/g, "Click on")
				.replace(
					/\bIf this term is difficult, the terminology of ([^,]+), it may help\b/g,
					"If the term $1 is difficult, it may help"
				)
				.replace(/\bTalk about how\b/gi, "Notice how")
				.replace(/\bPoint out that\b/gi, "Note that")
				.replace(/\bMake sure to explain that\b/gi, "Remember that")
				.replace(/\bMake sure\b/gi, "Ensure")
				.replace(/,\s+Ensure\b/g, ", ensure")
				.replace(/\bto Ensure\b/g, "to ensure")
				.replace(/\bEnsure to ([a-z])/g, capitalizeMatchedFirstLetter)
				.replace(/\bensure to ([a-z])/g, keepMatchedFirstLetter)
				.replace(
					/\bThis section covers how to\b/g,
					"This section develops how to"
				)
				.replace(/\bThis section covers\b/g, "This section develops")
				.replace(
					/\bThis lesson covers how to\b/g,
					"This lesson develops how to"
				)
				.replace(/\bThis lesson covers\b/g, "This lesson develops")
				.replace(/\bThe goal is to be able to\b/g, "The result is to")
				.replace(/\bthe goal is to be able to\b/g, "the result is to")
				.replace(/\bThe goal is to\b/g, "The result is to")
				.replace(/\bthe goal is to\b/g, "the result is to")
				.replace(
					/\bSummarize ([^.]+?) by naming\b/g,
					"A complete check for $1 names"
				)
				.replace(
					/\bBroadcast messages between\b/g,
					"Use broadcasts between"
				)
				.replace(/\bShow how to\b/gi, "Practice how to")
				.replace(/\bpractice how to ([a-z])/g, keepMatchedFirstLetter)
				.replace(
					/(^|\n\s*|[.!?]\s+|:\s+)Practice how to ([a-z])/g,
					(_match, prefix, first) =>
						`${prefix}${capitalizeFirstLetter(first)}`
				)
				.replace(
					/(^|\n\s*|[.!?]\s+|:\s+)Practice how ([a-z])/g,
					(_match, prefix, first) =>
						`${prefix}${capitalizeFirstLetter(first)}`
				)
				.replace(/\bPractice how to ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bPractice how ([a-z])/g, keepMatchedFirstLetter)
				.replace(/(^|[.!?]\s+)Show how\b/g, "$1Notice how")
				.replace(/(^|[.!?]\s+)Show why\b/g, "$1Explain why")
				.replace(/\bShow why\b/g, "Explain why")
				.replace(/\bshow why\b/g, "explain why")
				.replace(/\bShow where\b/g, "Identify where")
				.replace(/\bShow the difference between\b/g, "Compare")
				.replace(/\bShow the an example of\b/g, "Review an example of")
				.replace(
					/\bGuide learners to\b/g,
					"This section guides the process of"
				)
				.replace(/\bguide learners to\b/g, "guides the process of")
				.replace(/\bEncourage projects that\b/g, "Strong projects")
				.replace(/\bencourage projects that\b/g, "strong projects")
				.replace(/\bHelp compile\b/g, "Compile")
				.replace(/\bhelp compile\b/g, "compile")
				.replace(/\bshow the the\b/gi, "open the")
				.replace(
					/\bTake the time to introduce the to the various\b/g,
					"Explore the"
				)
				.replace(
					/\bHere are some rough projects you can use as guidance:/g,
					"Useful practice ideas:"
				)
				.replace(
					/\bask the student to ([a-z])/g,
					keepMatchedFirstLetter
				)
				.replace(/\bask them to ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bask them whether\b/g, "evaluate whether")
				.replace(/\bask them where\b/g, "identify where")
				.replace(/\bask them what\b/g, "describe what")
				.replace(/\bask them why\b/g, "explain why")
				.replace(/\bhave them ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bHave learners trace\b/g, "Trace")
				.replace(/\bhave learners trace\b/g, "trace")
				.replace(
					/\bCreate a new Scratch project\. Using this project as (?:a )?rough guide, introduce the ([^.]+)\./gi,
					"A Scratch project can be used to practice the $1."
				)
				.replace(
					/\bso the work can work faster, with less prompting, and with cleaner reasoning\b/gi,
					"to build speed, independence, and cleaner reasoning"
				)
				.replace(/\bso the work can ([a-z])/g, toMatchedFirstLetter)
				.replace(
					/\benough that the work can ([a-z])/g,
					enoughToMatchedFirstLetter
				)
				.replace(
					/\bThe course should repeatedly ask students to ([a-z])/g,
					repeatedlyMatchedFirstLetter
				)
				.replace(
					/\bthe course should repeatedly ask students to ([a-z])/g,
					lowercaseRepeatedlyMatchedFirstLetter
				)
				.replace(/\bConsider why\b/g, "Explain why")
				.replace(/\bask students why\b/g, "explain why")
				.replace(/\bask students what\b/g, "consider what")
				.replace(/\bthen ask them to\b/gi, "then add")
				.replace(/\bthen ask them\b/gi, "then include")
				.replace(/\bAsk students whether\b/g, "Evaluate whether")
				.replace(/\bask students whether\b/g, "evaluate whether")
				.replace(
					/\bAsk students to ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\bask students to ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bhave students ([a-z])/g, keepMatchedFirstLetter)
				.replace(
					/\bLet the student ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\blet the student ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bThe student should be able to\b/g, "Be able to")
				.replace(/\bthe student should be able to\b/g, "be able to")
				.replace(/\bBe able to\b/g, "be able to")
				.replace(/\bThe student should explain\b/g, "Explain")
				.replace(/\bthe student should explain\b/g, "explain")
				.replace(/\bThe student should identify\b/g, "Identify")
				.replace(/\bthe student should identify\b/g, "identify")
				.replace(
					/\bThey should not re-enter\b/g,
					"Keep these materials out of"
				)
				.replace(
					/\bThey should ([a-z]+)/g,
					(_match, verb: string) =>
						`A strong response ${thirdPersonVerb(verb)}`
				)
				.replace(/\bThe student should\b/g, "A complete response")
				.replace(/\bStudents should\b/g, "Complete responses")
				.replace(/\bthe student should\b/g, "a complete response")
				.replace(/\bstudents should\b/g, "complete responses")
				.replace(
					/\bwhen the student needs one more\b/gi,
					"for one more"
				)
				.replace(/\bwhen the student needs another\b/gi, "for another")
				.replace(
					/\bwhen the student needs a cleaner\b/gi,
					"for a cleaner"
				)
				.replace(/\bwhen the student needs a\b/gi, "for a")
				.replace(/\bwhen the student needs more\b/gi, "for more")
				.replace(/\bwhen the student needs to\b/gi, "to")
				.replace(
					/\bwhen the student still\b/gi,
					"when more practice still"
				)
				.replace(
					/\bwhen the student is ready for\b/gi,
					"when ready for"
				)
				.replace(
					/\bonce the student is comfortable\b/gi,
					"once comfortable"
				)
				.replace(
					/\bwhether the student is ready to move on\b/gi,
					"whether moving on is appropriate"
				)
				.replace(
					/\bdeepen the student's understanding\b/gi,
					"deepen understanding"
				)
				.replace(
					/\bthe student's current strengths\b/gi,
					"current strengths"
				)
				.replace(
					/\bthe student’s current strengths\b/gi,
					"current strengths"
				)
				.replace(/\bthe student's real shell\b/gi, "the real shell")
				.replace(
					/\bthe student's host machine\b/gi,
					"the real host machine"
				)
				.replace(
					/\bthe student’s host machine\b/gi,
					"the real host machine"
				)
				.replace(
					/\bthe student's future self\b/gi,
					"future maintenance"
				)
				.replace(/\bthe student's map\b/gi, "the learning plan")
				.replace(/\bthe student's goals\b/gi, "the learning goals")
				.replace(
					/\bonce the student builds the habit\b/gi,
					"once this debugging habit is built"
				)
				.replace(
					/\bUse the Student Class build\b/g,
					"The Student Class build"
				)
				.replace(
					/\bthe student-class build\b/gi,
					"the Student Class build"
				)
				.replace(/\bthe Student Class build\b/g, "Student Class")
				.replace(
					/\bfits the student's interests\b/gi,
					"fits personal interests"
				)
				.replace(
					/\bIdentify whether the student still struggles most with\b/g,
					"Identify remaining struggle areas across"
				)
				.replace(/\bpositioning the student for\b/gi, "preparing for")
				.replace(/\bso the student practices\b/gi, "to practice")
				.replace(
					/\bwhere the student now has\b/gi,
					"where the course now provides"
				)
				.replace(/\bwhere the student documents\b/gi, "that documents")
				.replace(
					/\bwhere the student chooses\b/gi,
					"where a real dataset is chosen"
				)
				.replace(
					/\bwhile the student explains how they found each answer\b/gi,
					"with an explanation of how each answer was found"
				)
				.replace(
					/\bwhile the student explains each step aloud\b/gi,
					"with a spoken explanation of each step"
				)
				.replace(
					/\bwhile the student talks through each answer\b/gi,
					"with an explanation of each answer"
				)
				.replace(
					/\bRecord where the student stopped\b/gi,
					"Record the stopping point"
				)
				.replace(/\bIf the student stalls\b/g, "If work stalls")
				.replace(/\bif the student stalls\b/g, "if work stalls")
				.replace(
					/\bPause whenever the student gets stuck\b/g,
					"Pause on stuck points"
				)
				.replace(
					/\bpause whenever the student gets stuck\b/g,
					"pause on stuck points"
				)
				.replace(/\bthe student gets stuck\b/g, "work gets stuck")
				.replace(
					/\bThe student solves\b/g,
					"A complete response solves"
				)
				.replace(
					/\bthe student solves\b/g,
					"a complete response solves"
				)
				.replace(/\bThe student keeps\b/g, "The error log keeps")
				.replace(/\bthe student keeps\b/g, "the error log keeps")
				.replace(/\bThe student includes\b/g, "The final work includes")
				.replace(/\bthe student includes\b/g, "the final work includes")
				.replace(/\bstudent suggests\b/g, "response suggests")
				.replace(/\bstudent answers\b/g, "response answers")
				.replace(/\bbefore the student enters\b/gi, "before entering")
				.replace(/\bstudent enters\b/g, "the entry uses")
				.replace(
					/\bThis section covers how to\b/g,
					"This section develops how to"
				)
				.replace(/\bThis section covers\b/g, "This section develops")
				.replace(
					/\bThis lesson covers how to\b/g,
					"This lesson develops how to"
				)
				.replace(/\bThis lesson covers\b/g, "This lesson develops")
				.replace(/\bThe learner should\b/g, "A complete response")
				.replace(/\bLearners should\b/g, "Complete responses")
				.replace(/\bthe learner should\b/g, "a complete response")
				.replace(/\blearners should\b/g, "complete responses")
				.replace(/\bThe goal is to be able to\b/g, "The result is to")
				.replace(/\bthe goal is to be able to\b/g, "the result is to")
				.replace(/\bThe goal is to\b/g, "The result is to")
				.replace(/\bthe goal is to\b/g, "the result is to")
				.replace(
					/\bThe learner can ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\bthe learner can ([a-z])/g, keepMatchedFirstLetter)
				.replace(/\bso learners can ([a-z])/g, toMatchedFirstLetter)
				.replace(/\bso learners build\b/g, "to build")
				.replace(/\bso students build\b/g, "to build")
				.replace(/\bso students practice\b/g, "to practice")
				.replace(/\bso students can reason\b/g, "to reason")
				.replace(
					/\bso learners understand\b/g,
					"so the concept is clear"
				)
				.replace(/\bbefore learners ([a-z])/g, beforeMatchedFirstLetter)
				.replace(
					/\bwhether learners can ([a-z])/g,
					workCanMatchedFirstLetter
				)
				.replace(
					/\bLearners can ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\blearners can ([a-z])/g, keepMatchedFirstLetter)
				.replace(
					/\blearners must ([a-z])/g,
					taskRequiresMatchedFirstLetter
				)
				.replace(
					/\bshould force learners to ([a-z])/g,
					taskRequiresMatchedFirstLetter
				)
				.replace(
					/\bshould force students to ([a-z])/g,
					taskRequiresMatchedFirstLetter
				)
				.replace(
					/\bmodel learners can still inspect\b/g,
					"model remains inspectable"
				)
				.replace(
					/\bwhich project or assessment proves that a learner can use the mapped skill independently\b/g,
					"which project or assessment proves independent use of the mapped skill"
				)
				.replace(/\blearners will actually use\b/g, "appear")
				.replace(/\blearners will actually see\b/g, "appear")
				.replace(
					/\blearners will actually encounter\b/g,
					"are common in practice"
				)
				.replace(
					/\bthat learners will compare at least two approaches on most serious datasets\b/g,
					"that serious datasets include at least two compared approaches"
				)
				.replace(
					/\bthat learners will finish the course able to ([a-z])/g,
					(_match, first: string) =>
						`that the course builds the ability to ${first}`
				)
				.replace(
					/\bthat learners will read binary and hexadecimal representations, use bitwise operators confidently, reason about layout and lifetime, and build small systems-style tools in C\b/g,
					"that this course covers binary and hexadecimal representations, confident bitwise operations, layout and lifetime reasoning, and small systems-style tools in C"
				)
				.replace(/\blearners will keep seeing\b/g, "recur")
				.replace(
					/\bhelps learners decide whether\b/gi,
					"helps identify whether"
				)
				.replace(
					/\bonce learners decide what information the structure must preserve\b/gi,
					"once the structure's required information is identified"
				)
				.replace(
					/\blearners decide what information\b/gi,
					"the relevant information is identified"
				)
				.replace(/\bthe learner's\b/g, "the work's")
				.replace(/\bthe learner\b/g, "the work")
				.replace(/\blearner suggests\b/g, "the response suggests")
				.replace(/\blearner answers\b/g, "the response answers")
				.replace(
					/\bThe student has tested or justified\b/g,
					"Test or justify"
				)
				.replace(
					/\bthe student has tested or justified\b/g,
					"test or justify"
				)
				.replace(/\bThe student tests\b/g, "Test")
				.replace(/\bthe student tests\b/g, "test")
				.replace(
					/\bThe student can ([a-z])/g,
					capitalizeMatchedFirstLetter
				)
				.replace(/\bthe student can ([a-z])/g, keepMatchedFirstLetter)
		)
	);

	return normalizeEvidenceSentence(
		normalizeSectionActionAgreement(normalizeSupportLabelText(neutralized))
	);
}

function neutralizeStudentFacingCourseText(course: RawCourse) {
	for (const module of course.modules) {
		module.title = neutralizeStudentFacingText(module.title);

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.title = neutralizeStudentFacingText(item.title);
				item.content = neutralizeStudentFacingText(item.content);
			}
		}
	}
}

const legacyBrandingReplacements: Array<[RegExp, string]> = [
	[/\bJuni Latin with File IO\b/g, "Word Translator with File I/O"],
	[/\bJuni Latin\b/g, "Word Translator"],
	[/\bJuni Archery\b/g, "Archery Simulator"],
	[/\bJuni World\b/g, "Theme Park Planner"],
	[/\bJunian Language Verifier\b/g, "Fictional Language Verifier"],
	[/\bJunian word\b/g, "fictional word"],
	[/\bJunian words\b/g, "fictional words"],
	[/\bJuni Assistant\b/g, "Command Assistant"],
	[/\bJuni Book Rule System\b/g, "Book Rule System"],
	[/\bJuni Bakery\b/g, "Bakery Model"],
	[/\bJuni Search Engine\b/g, "Mini Search Engine"],
	[/\bJuni Eatz\b/g, "Restaurant Splash Page"],
	[/\bJuni News\b/g, "News Homepage"],
	[/\bJuni Department Store\b/g, "Department Store Discounts"],
	[/\ba Word Translator function\b/g, "a word translator function"],
	[/\bsingle-folder Juni layout\b/g, "single-folder legacy layout"],
	[
		/\bolder single-folder Juni layout\b/g,
		"older single-folder legacy layout"
	],
	[/"Juni"/g, '"Lumo"']
];

function normalizeLegacyBrandingText(text: string) {
	return legacyBrandingReplacements.reduce(
		(current, [pattern, replacement]) =>
			current.replace(pattern, replacement),
		text
	);
}

function normalizeLegacyBranding(course: RawCourse) {
	course.name = normalizeLegacyBrandingText(course.name);

	for (const module of course.modules) {
		module.title = normalizeLegacyBrandingText(module.title);

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.title = normalizeLegacyBrandingText(item.title);
				item.content = normalizeLegacyBrandingText(item.content);
			}
		}
	}
}

function formatVisibleCourseMarkdown(course: RawCourse) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.content = formatVisibleMarkdownStructure(item.content);
			}
		}
	}
}

function contextText(context: CourseTextContext) {
	return `${context.courseId} ${context.course.name} ${context.module.title} ${context.item.title}`.toLowerCase();
}

function moduleItemText(context: CourseTextContext) {
	return `${context.module.title} ${context.item.title}`.toLowerCase();
}

function isCheckInContext(context: CourseTextContext) {
	return /\bcheck[- ]?in\b|practice exam|assessment/i.test(
		`${context.module.title} ${context.item.title}`
	);
}

function isScienceContext(context: CourseTextContext) {
	return [
		"elementary-science",
		"middle-school-integrated-science",
		"intro-to-chemistry",
		"intro-to-physics",
		"physics-level-2"
	].includes(context.courseId);
}

function isAppliedStudioContext(context: CourseTextContext) {
	return /applied studio|applied lab|studio|lab \d+/i.test(
		`${context.module.title} ${context.item.title}`
	);
}

function isBriefContent(content: string) {
	return wordCount(content) < 65 || compactWhitespace(content).length < 460;
}

function hasCompleteScratchSupportPrompt(context: CourseTextContext) {
	const source = contextText(context);
	if (!isScratchSource(source)) return false;

	const title = context.item.title;
	const content = context.item.content;
	if (/Fluency Drill/i.test(title)) {
		return (
			/\*\*Fluency goal:\*\*/i.test(content) &&
			/\*\*Practice path:\*\*/i.test(content) &&
			/\*\*(?:Completion check|Checkpoint):\*\*/i.test(content)
		);
	}

	if (/Open-Ended Variant/i.test(title)) {
		return (
			/\*\*Variant goal:\*\*/i.test(content) &&
			/\*\*Design path:\*\*/i.test(content) &&
			/\*\*Verification:\*\*/i.test(content)
		);
	}

	return false;
}

function needsContentSupport(context: CourseTextContext) {
	const content = context.item.content;
	if (!content.trim()) return true;
	if (hasCompleteScratchSupportPrompt(context)) return false;
	if (structuredSupportPattern.test(content)) return false;
	if (isInformationalResourceItem(context.item)) return false;

	return (
		placeholderContentPattern.test(content) ||
		isBriefContent(content) ||
		/Core Concepts|Application Check/.test(context.item.title) ||
		isAppliedStudioContext(context) ||
		(isProjectLikeItem(context.item) && wordCount(content) < 95) ||
		(isCheckInContext(context) && wordCount(content) < 120)
	);
}

function needsPygameProjectCompletionSupport(context: CourseTextContext) {
	const content = context.item.content;
	const source = contextText(context);

	return (
		isPygameSource(source) &&
		(context.courseId === "pygames" ||
			context.courseId === "pygames-classroom") &&
		/\bPyG\d/.test(context.module.title) &&
		/\bProject\b/i.test(context.item.title) &&
		!/\*\*(?:Outcome|Required outcome|Checkpoints|Completion checks|Extension):\*\*/i.test(
			content
		)
	);
}

function needsShortProjectReviewSupport(context: CourseTextContext) {
	const content = context.item.content;

	return (
		!hasCompleteScratchSupportPrompt(context) &&
		isProjectLikeItem(context.item) &&
		wordCount(content) < 95 &&
		!projectReviewSupportPattern.test(content)
	);
}

function pygameProjectCompletionSupport() {
	const projectReference = "the project";

	return [
		[
			"**Outcome:**",
			"- Define the project's visible state, actor or data responsibilities, frame update rule, rendering order, and any input, collision, scoring, or reset rules that apply.",
			`- Test ${projectReference} startup, the main animation or input behavior, and one boundary such as wraparound, reset, missed input, no-collision, or end state.`,
			`- Keep ${projectReference} drawing, updating, event handling, and state changes separated enough to debug one layer at a time.`
		].join("\n"),
		[
			"**Checkpoints:**",
			`- ${capitalizeSentence(projectReference)} starts from a predictable state and the main visible change can be replayed.`,
			"- The important state variable, actor position, list update, score, health, timer, or collision condition is checked where it applies.",
			"- The final explanation names the game loop behavior, the state that changed, and one edge case found during playtesting."
		].join("\n"),
		`**Extension:** Add one visual state, timing, input, collision, scoring, or reset variation while keeping the same update loop readable.`
	].join("\n\n");
}

const proceduralSentencePattern =
	/^(?:Add|Begin|Build|Calculate|Choose|Compare|Connect|Convert|Create|Define|Design|Develop|Draw|Experiment|Give|Implement|Initialize|In |Make|Place|Program|Reuse|Run|Set|Start|Test|Then|Tweak|Use|Using|When|Write)\b/i;

const projectGoalSentencePattern =
	/^(?:Build|Create|Design|Develop|Implement|In Colab|Make|Program|Simulate|Use|Using|Write)\b/i;

const conceptProcedureSentencePattern =
	/^This section (?:builds|covers|introduces|practices|reviews|uses)\b/i;

function splitSentenceList(text: string) {
	const sentences: string[] = [];
	let sentenceStart = 0;

	for (let index = 0; index < text.length; index++) {
		const character = text[index];
		if (!/[.!?]/.test(character)) continue;

		const nextCharacter = text[index + 1] ?? "";
		if (nextCharacter && !/\s/.test(nextCharacter)) continue;

		const sentence = text.slice(sentenceStart, index + 1).trim();
		if (/\b(?:vs|e\.g|i\.e|ex)\.$/i.test(sentence)) continue;
		if (sentence) sentences.push(sentence);
		sentenceStart = index + 1;
	}

	const remainder = text.slice(sentenceStart).trim();
	if (remainder) sentences.push(remainder);

	return sentences;
}

function formatDenseProjectProcedure(content: string) {
	const normalized = compactWhitespace(content);
	if (!normalized || preservesBlockStructure(content)) return content;
	if (structuredSupportPattern.test(content)) return content;

	const sentences = splitSentenceList(normalized);
	if (sentences.length < 4) return content;

	const [goal, ...steps] = sentences;
	if (!projectGoalSentencePattern.test(goal)) return content;

	const successCriteria = /^The finished\b/i.test(steps[0] ?? "")
		? steps.shift()
		: undefined;

	const proceduralSteps = steps.filter(step =>
		proceduralSentencePattern.test(step)
	);
	if (proceduralSteps.length < 2) return content;

	return [
		`**Project goal:** ${goal}`,
		successCriteria ? `**Success criteria:** ${successCriteria}` : "",
		`**Implementation steps:**\n${steps.map(step => `- ${step}`).join("\n")}`
	]
		.filter(Boolean)
		.join("\n\n");
}

function formatDenseConceptProcedure(content: string) {
	const normalized = compactWhitespace(content);
	if (!normalized || preservesBlockStructure(content)) return content;
	if (structuredSupportPattern.test(content)) return content;

	const sentences = splitSentenceList(normalized);
	if (sentences.length < 5) return content;

	const [focus, ...steps] = sentences;
	if (!conceptProcedureSentencePattern.test(focus)) return content;

	const proceduralSteps = steps.filter(step =>
		proceduralSentencePattern.test(step)
	);
	if (proceduralSteps.length < 3) return content;

	return [
		`**Concept focus:** ${focus}`,
		`**Practice sequence:**\n${steps.map(step => `- ${step}`).join("\n")}`
	].join("\n\n");
}

function formatDenseProcedureInstructions(course: RawCourse) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.content = isProjectLikeItem(item)
					? formatDenseProjectProcedure(item.content)
					: formatDenseConceptProcedure(item.content);
			}
		}
	}
}

function cleanSupportTopicTitle(title: string) {
	return cleanModuleTopicTitle(title)
		.replace(
			/^[A-Z]{1,5}\d+\s+(?:Project|Supplemental Project|Master Project)\s+\d+:\s*/iu,
			""
		)
		.replace(/^[A-Z]{1,5}\d+\s+Supplemental Graphics Project:\s*/iu, "")
		.replace(
			/^(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Understanding Check|Extension Challenge|Fluency Drill|Focused Practice|Guided Example|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Project|Review and Reflection|Review|Standards Practice Set|Supplemental Project|Verification and Reflection|Verification Review|Worked Example|Checkpoint):\s*/iu,
			""
		)
		.replace(
			/^(?:Project|Supplemental Project|Master Project)\s+\d+:\s*/iu,
			""
		)
		.replace(
			/^(?:Project|Supplemental Project|Master Project)\s+\d+\s*[-–—]\s*/iu,
			""
		)
		.replace(/\s{2,}/g, " ")
		.trim();
}

function supportFocusTopic(context: CourseTextContext) {
	const itemTitle = cleanSupportTopicTitle(context.item.title);
	const moduleTitle = cleanSupportTopicTitle(context.module.title);
	const normalizedItem = itemTitle.toLowerCase();
	const normalizedModule = moduleTitle.toLowerCase();
	const itemIsGeneric =
		!itemTitle ||
		genericSupportItemTitlePattern.test(itemTitle) ||
		/^core concepts(?: and (?:teaching flow|learning sequence))?$/i.test(
			itemTitle
		) ||
		normalizedItem === normalizedModule ||
		(Boolean(normalizedModule) &&
			normalizedItem.startsWith(`${normalizedModule}:`));

	return itemIsGeneric
		? moduleTitle || itemTitle || "this course item"
		: itemTitle;
}

function topicScopedFocus(context: CourseTextContext, area: string) {
	return `${supportFocusTopic(context)}: ${area}`;
}

function unscopedSubjectFocus(context: CourseTextContext) {
	const focus = subjectFocus(context);
	const topic = supportFocusTopic(context);
	const prefix = `${topic}: `;

	return focus.startsWith(prefix) ? focus.slice(prefix.length) : focus;
}

function subjectFocus(context: CourseTextContext) {
	const source = contextText(context);

	if (/ap computer science|apcs/.test(source)) {
		return topicScopedFocus(
			context,
			"AP CSA Java reasoning, including tracing code, explaining object state, writing method-level logic, and testing edge cases"
		);
	}
	if (isPythonTurtleContext(context) || /python level 1|grs/.test(source)) {
		return topicScopedFocus(
			context,
			"Turtle graphics and beginner Python fluency with coordinates, movement, loops, functions, event callbacks, canvas state, and readable code organization"
		);
	}
	if (/python level 2|ps\d/.test(source)) {
		return topicScopedFocus(
			context,
			"Python program design with control flow, data structures, user input, and careful testing of console behavior"
		);
	}
	if (/python level 3|advanced python|am\d/.test(source)) {
		return topicScopedFocus(
			context,
			"advanced Python decomposition, algorithmic reasoning, file/data handling, and clear testing habits"
		);
	}
	if (isPygameSource(source)) {
		return topicScopedFocus(
			context,
			"PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback"
		);
	}
	if (isScratchSource(source)) {
		return topicScopedFocus(context, scratchDesignFocus(context));
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return topicScopedFocus(
			context,
			"Swift app development with project structure, SwiftUI views, state flow, signing, simulator/device testing, and release readiness"
		);
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return topicScopedFocus(
			context,
			"Linux systems practice with shell commands, filesystems, users and permissions, services, logs, automation, and repeatable troubleshooting evidence"
		);
	}
	if (isScienceContext(context)) {
		return topicScopedFocus(
			context,
			"scientific explanation using observable phenomena, models, data, vocabulary, and claim-evidence-reasoning"
		);
	}
	if (isCppContext(context)) {
		return topicScopedFocus(
			context,
			"C++ engineering with types, memory ownership, containers, algorithms, command-line behavior, and repeatable tests"
		);
	}
	if (/c systems|systems build|assembly/.test(source)) {
		return topicScopedFocus(
			context,
			"systems programming with machine representation, memory layout, build tooling, low-level debugging, and safe constraints"
		);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		return variantPrompt(context, [
			() =>
				topicScopedFocus(
					context,
					"object-oriented Java design with classes, method contracts, object state, inheritance, interfaces, records, and tests"
				),
			() =>
				topicScopedFocus(
					context,
					"Java type design with objects, fields, methods, collection choices, public APIs, and compile-run feedback"
				),
			() =>
				topicScopedFocus(
					context,
					"Java program structure with constructors, object state, method behavior, access boundaries, and testable cases"
				),
			() =>
				topicScopedFocus(
					context,
					"Java reasoning with values versus references, class responsibilities, interfaces or records when useful, and visible verification"
				)
		]);
	}
	if (/usaco|competitive/.test(source)) {
		return topicScopedFocus(
			context,
			"competitive-programming discipline with input parsing, sample verification, edge cases, and complexity reasoning"
		);
	}
	if (/security|offensive|low-level security|network security/.test(source)) {
		return topicScopedFocus(
			context,
			"safe security analysis with local-only test fixtures, threat modeling, evidence collection, and defensive remediation"
		);
	}
	if (isNetworkSystemsContext(context, source)) {
		return topicScopedFocus(
			context,
			"network systems practice with addressing, routing, ports, DNS, packet evidence, service exposure, and diagnostic reasoning"
		);
	}
	if (
		/data science|data analysis|machine learning|ai search|ai level|model/.test(
			source
		)
	) {
		return topicScopedFocus(
			context,
			"data and model reasoning with dataset assumptions, measured output, interpretation, limitations, and responsible use"
		);
	}
	if (/unity|game development|game-mechanics/.test(source)) {
		return topicScopedFocus(
			context,
			"game development with scene setup, state changes, player feedback, playtesting, and a clear completion loop"
		);
	}
	if (isWebContext(context)) {
		return topicScopedFocus(
			context,
			"web-development workflow with user-facing behavior, browser checks, API/data flow, accessibility, and deployment readiness"
		);
	}
	if (/design pattern|refactoring|pattern implementation/.test(source)) {
		return topicScopedFocus(
			context,
			"software design tradeoffs involving naming, responsibilities, coupling, refactoring safety, and behavior-preserving tests"
		);
	}
	if (/algebra|geometry|calculus|math/.test(source)) {
		return topicScopedFocus(
			context,
			"mathematical reasoning through worked examples, notation, graph or table interpretation, and explanation of each step"
		);
	}

	return topicScopedFocus(
		context,
		"the central idea, one traceable example, and evidence that the result works"
	);
}

function scratchDesignFocus(context: CourseTextContext) {
	return variantPrompt(context, [
		() =>
			"Scratch game design: sprites, event blocks, broadcasts, variables, costumes or backdrops, loops, and playable feedback",
		() =>
			"Scratch game design: green-flag setup, sprite state, loops, sensing, reset behavior, and visible feedback",
		() =>
			"Scratch game design: player actions, block sequences, costume or backdrop changes, and clear stage feedback",
		() =>
			"Scratch game design: event flow, variables, collision or timing logic, and a visible progress or goal signal",
		() =>
			"Scratch game design: sprite responsibilities, control events, state updates, and a playable result that can be tested"
	]);
}

function isMathContext(context: CourseTextContext) {
	return /algebra|geometry|calculus|math/.test(contextText(context));
}

function isNetworkSystemsSource(source: string) {
	return /\b(?:network systems|dns|routing|packets?|tcpdump|ipv6|nat)\b/.test(
		source
	);
}

function isNetworkSystemsContext(context: CourseTextContext, source: string) {
	return !isSecurityContext(context) && isNetworkSystemsSource(source);
}

function isPygameSource(source: string) {
	return /pygames?|zrect|projectile|enemy ai|game loop/.test(source);
}

function isPythonTurtleContext(context: CourseTextContext) {
	return (
		context.courseId === "python-level-1" ||
		context.courseId === "python-level-1-classroom"
	);
}

function isScratchSource(source: string) {
	return (
		!isPygameSource(source) &&
		/scratch|sprite|broadcast|clone|backdrop|green flag|pen extension/.test(
			source
		)
	);
}

function isDataAiMlContext(context: CourseTextContext) {
	const courseId = context.courseId;
	if (
		/^(?:data-science-in-python|machine-learning|ai-level-1)$/.test(
			courseId
		)
	) {
		return true;
	}

	return /data science|data analysis|machine learning|ai search|ai level|dataset|model evaluation/.test(
		contextText(context)
	);
}

function isApcsContext(context: CourseTextContext) {
	return context.courseId === "ap-computer-science-a";
}

function isCompetitiveProgrammingContext(context: CourseTextContext) {
	return (
		context.courseId.startsWith("usaco-") ||
		/competitive programming|competitive-programming/.test(
			contextText(context)
		)
	);
}

function isSwiftAppContext(context: CourseTextContext) {
	return context.courseId === "intro-to-swift-app-development";
}

function isUnityContext(context: CourseTextContext) {
	return context.courseId === "unity-game-development";
}

function isCppContext(context: CourseTextContext) {
	if (
		/^(?:c-level-1|cpp-level-[123]|data-structures-and-algorithms-in-cpp|design-patterns-in-cpp)$/.test(
			context.courseId
		)
	) {
		return true;
	}

	if (context.courseId === "python-to-java-and-cpp-bridge") {
		return /c\+\+|cpp/.test(moduleItemText(context));
	}

	return /c\+\+|cpp|algorithm lab/.test(moduleItemText(context));
}

function isWebContext(context: CourseTextContext) {
	return (
		context.courseId === "web-development-foundations" ||
		context.courseId.startsWith("javascript-level-") ||
		/\b(?:web development|browser|dom|html|css|canvas|full-stack)\b/.test(
			contextText(context)
		)
	);
}

function isJavaContext(context: CourseTextContext) {
	return (
		isApcsContext(context) ||
		context.courseId.startsWith("java-") ||
		/\bjava\b/.test(contextText(context))
	);
}

function isGameContext(context: CourseTextContext) {
	const source = contextText(context);

	return (
		isScratchSource(source) ||
		isPygameSource(source) ||
		/unity|game development|game-mechanics/.test(source)
	);
}

function isSecurityContext(context: CourseTextContext) {
	return /^(?:network-security|low-level-security|low-level-security-part-2|rust-systems-security)$/.test(
		context.courseId
	);
}

function isSystemsContext(context: CourseTextContext) {
	return /^(?:linux-systems|network-systems|c-systems-engineering|assembly)$/.test(
		context.courseId
	);
}

function isLowLevelSystemsContext(context: CourseTextContext) {
	return /^(?:c-systems-engineering|assembly)$/.test(context.courseId);
}

function commonPitfalls(context: CourseTextContext) {
	const source = contextText(context);

	if (isScienceContext(context)) {
		return "Treating observations as conclusions, using vocabulary loosely, ignoring units or scale, or claiming that a model proves more than it actually shows.";
	}
	if (isMathContext(context)) {
		return `In ${context.module.title}, common mistakes include dropping negative signs or units, skipping the reason for an algebraic step, reading graph or table labels too quickly, or giving an answer without a context check.`;
	}
	if (isDataAiMlContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include assuming a dataset is complete or neutral, confusing correlation with explanation, trusting one metric without a baseline, or omitting limitations and responsible-use boundaries.`,
			subject =>
				`For ${subject}, common failure modes include uninspected missing values, unclear labels, metrics without baselines, conclusions that overclaim, and limitations that are mentioned only after the answer.`,
			subject =>
				`In ${subject}, likely mistakes include treating sampled data as the whole population, hiding cleaning choices, skipping a toy sanity check, or interpreting a model result without a comparison point.`,
			subject =>
				`For ${subject}, check whether the evidence source, transformation, metric, baseline, and caveat are visible before trusting the final interpretation.`
		]);
	}
	if (isApcsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include rushing past Java's exact syntax, confusing primitive values with object references, skipping trace tables, or testing only the example from the prompt.`,
			subject =>
				`For ${subject}, common failure modes include syntax that compiles differently than expected, object references treated like primitive values, missing trace tables, and edge cases copied from the sample only.`,
			subject =>
				`In ${subject}, likely mistakes include changing several Java statements before compiling, overlooking AP-style boundary cases, and explaining the answer without tracing state.`,
			subject =>
				`For ${subject}, check whether the Java syntax, state trace, sample run, and one AP-style edge case all support the final answer.`
		]);
	}
	if (isCompetitiveProgrammingContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include matching the sample without proving the general case, missing boundary sizes, using an algorithm that is too slow, or overlooking duplicate and tie cases.`,
			subject =>
				`For ${subject}, common failure modes include sample-only reasoning, untested smallest and largest inputs, hidden off-by-one errors, and complexity that does not fit the constraints.`,
			subject =>
				`In ${subject}, likely mistakes include coding before the invariant is clear, treating ties inconsistently, and skipping adversarial cases that expose ordering assumptions.`,
			subject =>
				`For ${subject}, check whether the input contract, invariant, edge cases, and time and memory bounds are explicit before trusting the solution.`
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include unclear state ownership, treating previews as full tests, overlooking empty or error states, and confusing Xcode configuration issues with app behavior.`,
			subject =>
				`For ${subject}, common failure modes include state that lives in the wrong view, previews that hide real simulator behavior, missing accessibility labels, and layouts that break at another size.`,
			subject =>
				`In ${subject}, likely mistakes include mixing navigation and model logic, verifying only the default preview, and ignoring error or empty data states.`,
			subject =>
				`For ${subject}, check whether state flow, simulator behavior, accessibility, layout, and build configuration are separated clearly enough to debug.`
		]);
	}
	if (isSecurityContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include blurring the authorized scope, changing a system before recording the baseline, trusting command output without interpretation, or skipping rollback evidence.`,
			subject =>
				`For ${subject}, common failure modes include unclear lab boundaries, missing before-and-after evidence, mitigation steps that are not verified, and command output copied without explanation.`,
			subject =>
				`In ${subject}, likely mistakes include testing outside the approved environment, changing too many settings at once, and omitting the evidence that confirms the final state.`,
			subject =>
				`For ${subject}, check whether the scope, baseline, command evidence, mitigation, rollback path, and final verification are all documented.`
		]);
	}
	if (isSystemsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include changing a toolchain or system state before recording the baseline, using commands whose effects are unclear, trusting output without interpretation, or skipping rollback and reproducibility evidence.`,
			subject =>
				`For ${subject}, common failure modes include hidden environment assumptions, commands that cannot be repeated, missing diagnostic output, and cleanup steps that are not documented.`,
			subject =>
				`In ${subject}, likely mistakes include editing too many variables at once, ignoring logs or traces, losing the before/after comparison, and leaving the final state hard to reproduce.`,
			subject =>
				`For ${subject}, check whether the command path, resource boundary, observed output, failure-mode check, and reset or rollback path are explicit.`
		]);
	}
	if (isGameContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include unclear start or reset state, event-order bugs, collision or score changes that are hard to trace, and feedback that does not show what changed.`,
			subject =>
				`For ${subject}, check for stale state, event-order bugs, scoring or timing updates that are hard to inspect, and player feedback that does not match the state.`,
			subject =>
				`In ${subject}, likely issues include missing reset behavior, controls that work only once, collisions that update the wrong variable, or visual feedback that hides the cause of the result.`,
			subject =>
				`For ${subject}, check for hidden state, sprite scripts that race each other, score or timer changes without visible evidence, and restart behavior that leaves old values behind.`
		]);
	}
	if (isWebContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include building only the default interaction, hiding loading or error states, ignoring keyboard and screen-size behavior, or letting UI state drift away from the data source.`,
			subject =>
				`For ${subject}, common failure modes include interactions that work only with perfect input, missing empty or failure states, inaccessible controls, and layouts that collapse on narrow screens.`,
			subject =>
				`In ${subject}, likely mistakes include updating the DOM without updating state, handling clicks but not keyboard use, and testing only one viewport or browser state.`,
			subject =>
				`For ${subject}, check whether the data source, state transition, visible feedback, error handling, accessibility, and responsive layout all agree.`
		]);
	}
	if (/python/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common mistakes include mixing input, calculation, and output in one hard-to-test block; mutating a list while looping; missing a return value; or only testing the easiest input.`,
			subject =>
				`For ${subject}, common failure modes include helper functions that depend on hidden input, loops that skip or double-count values, unclear list mutation, and output that cannot be checked independently.`,
			subject =>
				`In ${subject}, likely bugs include off-by-one loops, branches that never run, functions that print instead of return when a value is needed, and tests that only cover the easiest input.`,
			subject =>
				`For ${subject}, check whether data setup, transformation, and output are separated enough to test a standard scenario and a boundary scenario without guessing.`
		]);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common mistakes include confusing class and object responsibilities, using static state when instance state is needed, comparing objects incorrectly, or skipping compile/run feedback after a small change.`,
			subject =>
				`In ${subject}, check for unclear ownership of state, public methods that do too much, equality checks that compare the wrong thing, or tests that only cover the sample path.`,
			subject =>
				`For ${subject}, likely mistakes include mixing constructor setup with behavior, hiding state changes, overusing static helpers, or changing several methods before compiling.`,
			subject =>
				`For ${subject}, check for mismatched types, object-reference assumptions, incomplete edge cases, and method boundaries that make the class harder to test.`
		]);
	}
	if (/c\+\+|cpp/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`In ${subject}, common failure modes include losing track of ownership or lifetime, mixing indices with values, ignoring compiler warnings, or testing only the case that appears in the prompt.`,
			subject =>
				`For ${subject}, common failure modes include unclear resource ownership, stale references, unchecked bounds, copied data that was expected to alias, and diagnostics that are ignored.`,
			subject =>
				`In ${subject}, likely mistakes include relying on undefined behavior, hiding allocation or lifetime decisions, skipping edge-size inputs, and treating compiler warnings as optional.`,
			subject =>
				`For ${subject}, check whether representation, invariants, ownership, error cases, and compile/run evidence are visible before extending the program.`
		]);
	}
	if (/design pattern|refactoring|pattern implementation/.test(source)) {
		return "Adding abstraction before there is a real variation, changing behavior during refactoring, hiding responsibilities behind vague names, or skipping before-and-after tests.";
	}

	return "Confusing the example with the general rule, skipping a boundary condition, leaving assumptions unstated, or accepting a result without evidence.";
}

function failureModeGuidance(context: CourseTextContext) {
	return commonPitfalls(context)
		.replace(/\bCommon pitfalls\b/g, "Common failure modes")
		.replace(/\bcommon pitfalls\b/g, "common failure modes")
		.replace(
			/\bFor ([^.,\n]{1,140}), check for\b/g,
			"For $1, failure modes include"
		)
		.replace(
			/\bIn ([^.,\n]{1,140}), check for\b/g,
			"In $1, failure modes include"
		)
		.replace(
			/\bFor ([^.,\n]{1,140}), check whether\b/g,
			"For $1, verification asks whether"
		);
}

function diagnosticCategories(context: CourseTextContext) {
	if (isScienceContext(context))
		return "vocabulary, observation quality, model choice, evidence, reasoning, or units and scale";
	if (isMathContext(context))
		return "vocabulary, representation choice, algebraic procedure, graph or table reading, or reasonableness";
	if (isDataAiMlContext(context))
		return "data quality, feature or metric choice, interpretation, limitation, or responsible-use boundary";
	if (isSwiftAppContext(context))
		return "state ownership, view structure, navigation, layout, accessibility, build configuration, or simulator behavior";
	if (isSecurityContext(context))
		return "scope, command syntax, configuration, evidence interpretation, rollback, or mitigation";
	if (isSystemsContext(context))
		return "toolchain setup, command syntax, configuration, evidence interpretation, rollback, or reproducibility";
	if (isGameContext(context))
		return "event timing, state reset, controls, collision logic, scoring, or player feedback";

	return "vocabulary, tracing, syntax, design, or test coverage";
}

const genericCheckInCheckpointReference =
	"(?:[A-Z][A-Za-z0-9 +&:.-]{0,80}: )?Check-?[Ii]n #?\\d+(?:: [^.!?\\n]{1,100})?(?: Overview)? checkpoint";

function polishDiagnosticSupportText(text: string) {
	return text
		.replace(
			/\bUse (the [^.!?\n]{1,160}? checkpoint) to ([a-z])/g,
			(_match: string, subject: string, first: string) =>
				`For ${subject}, ${first}`
		)
		.replace(
			/\bUse (the [^.!?\n]{1,160}? checkpoint) as ([^.?!\n]+)/g,
			(_match: string, subject: string, detail: string) =>
				`Treat ${subject} as ${detail}`
		)
		.replace(
			new RegExp(
				`\\bFor the ${genericCheckInCheckpointReference}\\b`,
				"g"
			),
			"For this checkpoint"
		)
		.replace(
			new RegExp(
				`\\bIn the ${genericCheckInCheckpointReference}\\b`,
				"g"
			),
			"In this checkpoint"
		)
		.replace(
			new RegExp(`\\bThe ${genericCheckInCheckpointReference}\\b`, "g"),
			"This checkpoint"
		)
		.replace(
			new RegExp(`\\bthe ${genericCheckInCheckpointReference}\\b`, "g"),
			"this checkpoint"
		)
		.replace(
			/\bThis checkpoint independent attempt\b/g,
			"The independent attempt"
		)
		.replace(
			/\bthis checkpoint independent attempt\b/g,
			"the independent attempt"
		)
		.replace(/\bThis checkpoint explanation\b/g, "The explanation")
		.replace(/\bthis checkpoint explanation\b/g, "the explanation")
		.replace(
			/\b(Add a transfer example to|Create a second version of|Modify) this checkpoint\b/g,
			"$1 the checkpoint"
		);
}

function evidenceForSubject(subject: string, details: string) {
	const trimmed = subject.trim();

	return `${trimmed} is demonstrated by ${details}`;
}

function normalizeEvidenceSentence(text: string) {
	return text.replace(
		/\bEvidence for The (.{1,160}?) includes\b/g,
		"The $1 evidence includes"
	);
}

function proficiencyEvidence(context: CourseTextContext) {
	if (isScienceContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the model, cite the evidence, explain the vocabulary, and describe how the conclusion would change under one new condition.`,
			subject =>
				`Use ${subject} to connect one observation, one model limitation, one vocabulary term, and one evidence-based conclusion.`,
			subject =>
				evidenceForSubject(
					subject,
					"the phenomenon, supporting evidence, key term, and a revised claim for one changed condition."
				),
			subject =>
				`For ${subject}, demonstrate that the model, data, units or scale, and conclusion are connected without claiming more than the evidence supports.`
		]);
	}
	if (isMathContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be reasonable.`,
			subject =>
				`Use ${subject} to show the representation, calculation step, reasonableness check, and one corrected error.`,
			subject =>
				evidenceForSubject(
					subject,
					"the rule being practiced, a changed example, and a reasonableness explanation tied to the context."
				),
			subject =>
				`For ${subject}, demonstrate the procedure, justify the key step, and catch one common mistake before moving on.`
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the question, inspect the evidence, compare against a baseline or sanity check, and state one limitation of the result.`,
			subject =>
				`Use ${subject} to show the path from source data or state space to result, including one intermediate check and one caveat about interpretation.`,
			subject =>
				evidenceForSubject(
					subject,
					"the metric or source, the processing change, and a clear separation between measured output and conclusion."
				),
			subject =>
				`For ${subject}, demonstrate one small hand-checkable case, one representative result, and one reason the result is not generalizable too far.`
		]);
	}
	if (isApcsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, trace the Java state, compile or run the target method, test a standard scenario and an edge case, and explain the AP-style reasoning in precise vocabulary.`,
			subject =>
				`Use ${subject} to show the key Java syntax or API choice, the state trace, one successful run, and one boundary case tied to AP-style reasoning.`,
			subject =>
				evidenceForSubject(
					subject,
					"the Java concept, a value trace, a changed input, and a reason the result follows from the code."
				),
			subject =>
				`For ${subject}, demonstrate compile/run evidence, a trace table or equivalent state explanation, and one edge case that protects against a common AP mistake.`
		]);
	}
	if (isCompetitiveProgrammingContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, pass the samples, explain the invariant or algorithm idea, test a smallest and largest relevant case, and justify the time and memory complexity.`,
			subject =>
				`Use ${subject} to show the input/output contract, a hand-traced case, the accepted sample behavior, and one boundary case that fits the constraints.`,
			subject =>
				evidenceForSubject(
					subject,
					"the invariant, the duplicate or tie case, and a complexity check for the largest input."
				),
			subject =>
				`For ${subject}, demonstrate sample correctness, one adversarial custom case, and a concise explanation of why the algorithm preserves the intended property.`
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the state flow, show the normal interaction, verify one empty or error case, and separate app behavior from Xcode or simulator configuration.`,
			subject =>
				`Use ${subject} to demonstrate the screen state, the user action that changes it, one simulator-verified path, and one layout or accessibility check.`,
			subject =>
				evidenceForSubject(
					subject,
					"the state owner, interaction result, and whether any issue comes from code, preview data, or project configuration."
				),
			subject =>
				`For ${subject}, verify launch behavior, one target interaction, one edge state, and the evidence that the SwiftUI view responds correctly.`
		]);
	}
	if (isSecurityContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, state the scope, show the command or configuration evidence, explain the impact, and verify the rollback, mitigation, or final state.`,
			subject =>
				`Use ${subject} to document the authorized boundary, baseline evidence, diagnostic output, and the mitigation or hardening check that proves the result.`,
			subject =>
				evidenceForSubject(
					subject,
					"the risk, relevant log or configuration, and how the final state reduces or contains it."
				),
			subject =>
				`For ${subject}, demonstrate before-and-after evidence, the command path, the safe rollback or containment plan, and the final verification step.`
		]);
	}
	if (isSystemsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, state the starting environment, show the command or configuration evidence, explain the result, and verify rollback or reproducibility.`,
			subject =>
				`Use ${subject} to document setup, command path, observed output, diagnostic evidence, and the cleanup or rerun step that proves reproducibility.`,
			subject =>
				evidenceForSubject(
					subject,
					"the system boundary, one healthy output, one diagnostic output, and the assumption that controls the result."
				),
			subject =>
				`For ${subject}, demonstrate the intended behavior, one failure or edge path, and the command sequence needed to repeat the result.`
		]);
	}
	if (isGameContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the main state change, show the normal play path, test one edge case, and describe how the player can tell the result worked.`,
			subject =>
				`Trace one ${subject} player action through events, variables, and visible feedback, then replay the project from a clean start.`,
			subject =>
				evidenceForSubject(
					subject,
					"the key state variable or event chain, the expected play path, and one awkward input or boundary case."
				),
			subject =>
				`For ${subject}, show the start state, the interaction that changes it, the feedback that confirms it, and one reset or replay check.`
		]);
	}
	if (isWebContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the user flow, show the data or state transition, verify loading, success, and error behavior, and check narrow and wide layouts.`,
			subject =>
				`Use ${subject} to demonstrate one visible interaction, the state or DOM change behind it, an empty or invalid input, and a keyboard or responsive-layout check.`,
			subject =>
				evidenceForSubject(
					subject,
					"the user goal, event-to-output trace, and confirmation that both normal and failure paths work."
				),
			subject =>
				`For ${subject}, verify the browser behavior with a normal action, an edge input, visible feedback, and one accessibility or screen-size check.`
		]);
	}
	if (/python/.test(contextText(context))) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the data flow, run a standard scenario and an edge case, and point to the function or loop where the main transformation happens.`,
			subject =>
				`Use ${subject} to trace the input or setup value through the main branch, loop, or helper function, then verify the output with one changed input.`,
			subject =>
				evidenceForSubject(
					subject,
					"the data shape, transformation step, output evidence, and one boundary case that protects the logic."
				),
			subject =>
				`For ${subject}, demonstrate that the Python code is readable, runnable, and testable by showing the main path plus one case that would catch a common mistake.`
		]);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Explain the object roles in ${subject}, show the method call or test that proves the behavior, and identify one state or type decision that matters.`,
			subject =>
				`For ${subject}, name the responsible class or record, demonstrate the public behavior, and explain one edge case tied to object state or type choice.`,
			subject =>
				`Use ${subject} to show how the constructor, method, field, interface, or collection choice affects the result, then verify it with a small run or test.`,
			subject =>
				evidenceForSubject(
					subject,
					"the API boundary, the data it protects or exposes, and evidence that the behavior works."
				)
		]);
	}
	if (/c\+\+|cpp/.test(contextText(context))) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, explain the data representation, show the compile/run or test evidence, and identify one ownership, lifetime, or container choice that matters.`,
			subject =>
				`Use ${subject} to show the invariant, the command that proves behavior, and one bounds, copying, lifetime, or complexity decision.`,
			subject =>
				evidenceForSubject(
					subject,
					"the representation, one normal trace, and one diagnostic result tied to ownership or memory behavior."
				),
			subject =>
				`For ${subject}, demonstrate the public behavior, one edge input, and the C++ design choice that protects correctness or performance.`
		]);
	}

	return "Explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be correct.";
}

function remediationPrompt(context: CourseTextContext) {
	if (isScienceContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the specific misconception, revise one evidence sentence, and revisit the same vocabulary in a second phenomenon.`,
			subject =>
				`Use ${subject} to isolate the unclear term, compare it with one observation, and rewrite the claim so the evidence and model limitation are explicit.`,
			subject =>
				`In ${subject}, correct one narrow reasoning step, then apply the same vocabulary to a related example before moving on.`,
			subject =>
				`For ${subject}, identify whether the gap is vocabulary, units, model choice, or evidence quality, then retry the explanation with one changed condition.`
		]);
	}
	if (isMathContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the exact step that broke down, complete one focused review problem, and revisit the same skill before moving to a more complex project.`,
			subject =>
				`Use ${subject} to isolate the representation, sign, unit, graph, or algebra step that failed, then retry a smaller example.`,
			subject =>
				`In ${subject}, correct one narrow mistake, explain why the correction works, and apply the same rule to a changed problem.`,
			subject =>
				`For ${subject}, record the misconception, solve one targeted practice case, and check reasonableness before returning to the larger task.`
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the data or interpretation issue, run one smaller sanity check, and revise the limitation statement before extending the project.`,
			subject =>
				`Use ${subject} to isolate the missing-value, label, metric, baseline, or assumption problem before trusting the larger result.`,
			subject =>
				`In ${subject}, rerun a toy case, inspect one intermediate result, and update the caveat that explains where the conclusion is limited.`,
			subject =>
				`For ${subject}, identify the evidence gap, repair the smallest reproducible example, and separate measured output from interpretation.`
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the state, layout, navigation, or build issue, reproduce it in the smallest screen, and verify the simulator or preview path before adding features.`,
			subject =>
				`Use ${subject} to isolate the view, state owner, preview data, or Xcode configuration issue before expanding the app path.`,
			subject =>
				`In ${subject}, shrink the problem to one screen or interaction, compare preview and simulator behavior, and verify the corrected path.`,
			subject =>
				`For ${subject}, record the missing state or layout evidence, retest the smallest interaction, and confirm the app behavior is independent of preview-only data.`
		]);
	}
	if (isSecurityContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the missing evidence or unsafe assumption, repeat the smallest safe diagnostic, and document the rollback or mitigation before continuing.`,
			subject =>
				`Use ${subject} to isolate the scope, baseline, command output, configuration, or mitigation evidence that needs a smaller local check.`,
			subject =>
				`In ${subject}, rerun the narrowest safe diagnostic, compare before-and-after evidence, and record the rollback or containment step.`,
			subject =>
				`For ${subject}, identify the unsupported security claim, gather the local evidence, and verify the final hardening or mitigation state before extending scope.`
		]);
	}
	if (isSystemsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the missing evidence or environment assumption, repeat the smallest safe diagnostic, and document rollback or reproducibility before continuing.`,
			subject =>
				`Use ${subject} to isolate the command, configuration, log, permission, service, memory, or process assumption that needs a smaller check.`,
			subject =>
				`In ${subject}, rerun the smallest reproducible diagnostic, compare healthy and failing output, and document cleanup before extending scope.`,
			subject =>
				`For ${subject}, record the missing evidence, repeat the narrowest command path, and confirm the final state can be reproduced or rolled back.`
		]);
	}
	if (isGameContext(context)) {
		return variantPrompt(context, [
			subject =>
				`For ${subject}, name the event, state, or feedback issue, test it in the smallest possible scene, and verify the reset or replay path before adding features.`,
			subject =>
				`In ${subject}, isolate the sprite, event, variable, collision, or feedback step that fails, then retest from a clean start.`,
			subject =>
				`Use ${subject} to shrink the bug to one event chain, fix the smallest state issue, and replay the standard path plus one edge input.`,
			subject =>
				`For ${subject}, record the broken behavior, the block or state change that caused it, and the reset check that proves the fix.`
		]);
	}

	return variantPrompt(context, [
		subject =>
			`Record the specific misconception in ${subject}, complete one focused review problem, and revisit the same skill before moving to a more complex project.`,
		subject =>
			`For ${subject}, identify the missing vocabulary, trace step, syntax habit, design choice, or test case, then retry a smaller version.`,
		subject =>
			`Use ${subject} to name the blocker, solve one narrower practice case, and return to the original prompt with the corrected idea.`,
		subject =>
			`Isolate the smallest difficult step in ${subject}, correct it with one focused example, and record what changed.`,
		subject =>
			`Turn ${subject} into a shorter rehearsal: name the uncertain idea, solve one minimal case, and then rebuild the original task.`,
		subject =>
			`For ${subject}, separate vocabulary confusion from process confusion, then repair the first step that fails.`,
		subject =>
			`Use ${subject} to create one simpler example that proves the missing rule before returning to the full checkpoint.`,
		subject =>
			`In ${subject}, write the expected result first, compare it with the attempted result, and revise the smallest mismatch.`
	]);
}

function diagnosticExtensionPrompt(context: CourseTextContext) {
	if (isScienceContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one variable, phenomenon, or evidence source in ${subject} while keeping the same scientific question.`,
			subject =>
				`Add a second model or dataset to ${subject} and explain what stays consistent.`,
			subject =>
				`Change one unit, scale, or model limit in ${subject} and predict how the claim changes.`,
			subject =>
				`Apply the ${subject} question to a related phenomenon and name the evidence needed to compare it.`
		]);
	}
	if (isMathContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one value or constraint in ${subject} while preserving the same underlying rule.`,
			subject =>
				`Represent ${subject} a second way and explain why the two forms agree.`,
			subject =>
				`Add one error pattern to ${subject} and correct it using the same rule.`,
			subject =>
				`Change the context or units in ${subject} and check whether the result remains reasonable.`
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one data slice or metric in ${subject} while preserving the same analysis question.`,
			subject =>
				`Add a baseline or sanity check to ${subject} and compare how the interpretation changes.`,
			subject =>
				`Change one visualization or feature choice in ${subject} and record the limitation it exposes.`,
			subject =>
				`Add one failure-mode check to ${subject} and separate evidence from speculation.`
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one state or navigation path in ${subject} while preserving the intended app behavior.`,
			subject =>
				`Add an empty, loading, or error state to ${subject} and verify it in the simulator.`,
			subject =>
				`Check ${subject} at a different screen size or Dynamic Type setting and record one UI adjustment.`,
			subject =>
				`Add one accessibility requirement to ${subject} and explain how the app exposes it.`
		]);
	}
	if (isSecurityContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one authorized scenario or baseline artifact in ${subject} while preserving safe scope.`,
			subject =>
				`Add a mitigation or verification step to ${subject} and capture the before/after evidence.`,
			subject =>
				`Change one configuration in ${subject} and document the rollback path before testing.`,
			subject =>
				`Add one detection or hardening check to ${subject} and explain what risk it addresses.`
		]);
	}
	if (isSystemsContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one environment assumption or command option in ${subject} while preserving the same system goal.`,
			subject =>
				`Add a configuration or rollback check to ${subject} and verify it from a clean shell.`,
			subject =>
				`Add one reproducibility check to ${subject} that records command, output, and starting state.`,
			subject =>
				`Change one file, process, service, or permission detail in ${subject} and record the diagnostic evidence.`
		]);
	}
	if (isGameContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Change one rule or control in ${subject} while preserving the same play goal.`,
			subject =>
				`Add a state transition, collision case, or scoring rule to ${subject} and test the replay path.`,
			subject =>
				`Change one player-feedback requirement in ${subject} and explain how the player notices the result.`,
			subject =>
				`Add one difficulty or reset variation to ${subject} and keep the win/loss condition clear.`
		]);
	}

	return variantPrompt(context, [
		subject =>
			`Change one constraint or case in ${subject} while preserving the underlying rule or skill.`,
		subject =>
			`Represent ${subject} a second way and explain what stays equivalent.`,
		subject =>
			`Add one edge case to ${subject} and identify which requirement it tests.`,
		subject =>
			`Change one success condition in ${subject} and compare it with the original version.`,
		subject =>
			`Create a second version of ${subject} with a different input, representation, or explanation path.`,
		subject =>
			`Add a transfer example to ${subject} that uses the same idea in a new context.`,
		subject =>
			`Modify ${subject} so one assumption changes, then explain which part of the original reasoning still works.`,
		subject =>
			`Add one verification step to ${subject} that would catch a different mistake than the original check.`
	]);
}

function projectExpectations(context: CourseTextContext) {
	const source = contextText(context);
	const subject = extensionSubject(context);

	if (isPygameSource(source)) {
		return [
			`- Define the ${subject} game state, actor responsibilities, input events, collision rules, and frame-by-frame update loop.`,
			`- Test ${subject} startup, player controls, collision/no-collision cases, scoring or health changes, and reset or end-state behavior.`,
			`- Keep ${subject} drawing, updating, event handling, and game-state changes separated enough to debug one layer at a time.`
		];
	}
	if (isScratchSource(source)) {
		return variantLines(context, [
			subject => [
				`- Define what each ${subject} sprite controls, senses, changes, or broadcasts.`,
				`- Test ${subject} from the green-flag start through the main controls or events and the win, loss, score, or reset condition.`,
				`- Keep ${subject} explainable by naming the event blocks, variables, and state changes that drive the behavior.`
			],
			subject => [
				`- Map ${subject} sprites to events, variables, costumes, sounds, broadcasts, or clone behavior before adding polish.`,
				`- Test ${subject} startup, one normal play path, one reset path, and one scoring or boundary case.`,
				`- For ${subject}, identify the block sequence that controls the stage result.`
			],
			subject => [
				`- Identify the ${subject} player action, sprite response, state variable, and feedback shown on the stage.`,
				`- Test ${subject} with intended input, repeated input, and an ignored-input case where the state remains unchanged.`,
				`- Keep ${subject} logic traceable from event block to state change to visible stage behavior.`
			]
		]);
	}
	if (isUnityContext(context)) {
		return [
			`- Define the ${subject} scene, player action, object responsibilities, state changes, win/loss or completion condition, and visible feedback.`,
			`- Playtest ${subject} startup, normal controls, one collision or interaction edge case, and the reset or replay path.`,
			`- Keep ${subject} scripts, prefabs, scene setup, and inspector configuration documented enough that the behavior can be reproduced.`
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} screen, state owner, data flow, build target, and simulator or device behavior before implementation.`,
				`- Test ${subject} with a fresh launch, one normal interaction, one empty/error state when relevant, and one layout or accessibility check.`,
				`- Record the ${subject} Xcode, signing, preview, simulator, or TestFlight evidence that confirms the app state is understood.`
			],
			subject => [
				`- Name the ${subject} view hierarchy, source of truth, user action, expected state change, and target simulator.`,
				`- Check ${subject} after launch, after one normal interaction, and after one empty, invalid, or navigation edge case.`,
				`- Keep ${subject} build, preview, simulator, signing, or release evidence visible enough to reproduce the result.`
			],
			subject => [
				`- Map ${subject} from screen to model/state owner, data flow, user action, and observable app response.`,
				`- Verify ${subject} on the intended target plus one layout, accessibility, loading, or error condition.`,
				`- Record the ${subject} project setting, build result, preview, simulator, or device evidence that matters.`
			],
			subject => [
				`- State the ${subject} app path, state transition, persistence or navigation boundary, and success signal before coding.`,
				`- Run ${subject} from a clean launch and inspect one ordinary interaction plus one edge or accessibility case.`,
				`- For ${subject}, note the Swift, SwiftUI, Xcode, signing, or simulator detail that controls the observed behavior.`
			]
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} state, data, features, actions, model, or search space before implementation.`,
				`- Test ${subject} with a tiny traceable case, a standard case, and one boundary or failure-mode case that challenges the algorithm or interpretation.`,
				`- Identify the ${subject} evidence used to judge the result: trace, metric, sanity check, baseline, visualization, or limitation.`
			],
			subject => [
				`- State the ${subject} input representation, expected behavior, and evaluation signal before building.`,
				`- Test ${subject} with a hand-checkable case, a representative case, and one case where the result is uncertain or limited.`,
				`- For ${subject}, explain which trace, score, comparison, or visualization supports the conclusion.`
			],
			subject => [
				`- Identify the ${subject} assumptions about data, state, actions, search, rules, or scoring before implementation.`,
				`- Compare ${subject} against a baseline, simple trace, or known-answer example before accepting a larger result.`,
				`- Record one ${subject} limitation that would change the interpretation or next experiment.`
			]
		]);
	}
	if (isCompetitiveProgrammingContext(context)) {
		return variantLines(context, [
			subject => [
				`- State the ${subject} input format, output format, constraints, and algorithm idea before coding.`,
				`- Test the ${subject} sample exactly, then add a smallest case, a boundary case, and a duplicate, tie, or adversarial case when relevant.`,
				`- Record the ${subject} time and memory complexity and why those bounds fit the problem constraints.`
			],
			subject => [
				`- Translate ${subject} into variables, input contract, output contract, constraints, and the invariant the algorithm must preserve.`,
				`- Check ${subject} with the official sample, a tiny hand-built case, and one case aimed at ordering, duplicates, ties, or bounds.`,
				`- Write the ${subject} complexity target before coding and compare it with the largest allowed input.`
			],
			subject => [
				`- Identify the ${subject} data shape, required output, constraint limits, and algorithm strategy before implementation.`,
				`- Verify ${subject} against the sample plus one smallest case and one adversarial or boundary-shaped case.`,
				`- Explain why the ${subject} runtime and memory use are safe for the stated limits.`
			],
			subject => [
				`- Restate the ${subject} problem as exact input, exact output, preserved invariant, and complexity budget.`,
				"- Trace one tiny hand-checkable case before coding, then run the sample and one non-sample edge case.",
				`- Record the ${subject} algorithm idea, complexity class, and one assumption the tests are meant to challenge.`
			]
		]);
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return [
			`- State the ${subject} command, file path, service, permission, process, or log being inspected before making changes.`,
			`- Verify the ${subject} standard path and one failure or rollback path using command output, logs, status checks, or file metadata.`,
			`- Keep a short ${subject} operations note with the exact commands used and the evidence that the system reached the intended state.`
		];
	}
	if (isNetworkSystemsContext(context, source)) {
		return [
			`- Define the ${subject} hosts, addresses, ports, routes, protocols, and trust boundaries before running diagnostics.`,
			`- Test ${subject} local behavior, remote or cross-host behavior, and one failure-mode case using command output or packet/service evidence.`,
			`- Record the ${subject} observed symptom, diagnostic command, interpretation, and configuration or topology fact it proves.`
		];
	}
	if (isLowLevelSystemsContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} build command, source/header boundary, runtime input, memory assumption, or observable machine behavior before implementation.`,
				`- Verify ${subject} normal behavior and one failure path with compiler output, sanitizer output, return codes, register or memory traces, logs, or command-line output.`,
				`- Record the command and evidence for ${subject} so the systems behavior can be reproduced from a clean checkout or shell.`
			],
			subject => [
				`- State the ${subject} toolchain, source files, expected runtime signal, and resource or memory boundary before changing code.`,
				`- Check ${subject} with one ordinary run and one diagnostic run using compiler warnings, return codes, debugger state, sanitizer output, or logs.`,
				`- Keep the ${subject} reproduction note focused on the exact command, starting state, and observed low-level evidence.`
			],
			subject => [
				`- Name the ${subject} entry point, headers or linked files, input fixture, and system assumption being tested.`,
				`- Compare expected output with a boundary or fault-shaped case, then inspect one memory, register, process, or trace detail.`,
				`- Record enough ${subject} terminal evidence that the result can be rerun without hidden IDE state.`
			],
			subject => [
				`- Identify the ${subject} compile target, runtime setup, ownership or layout assumption, and success signal before implementation.`,
				`- Use a small successful run, a failing or edge run, and one tool-backed observation to verify behavior.`,
				`- For ${subject}, note the command, diagnostic, or representation detail that would matter most during troubleshooting.`
			],
			subject => [
				`- Describe the ${subject} inputs, outputs, files, build flags, and cleanup or rollback path before running it.`,
				`- Capture evidence from both the intended path and a path that stresses bounds, lifetime, permissions, or process state.`,
				`- Explain the ${subject} result through the observed command output rather than only through source-code intent.`
			],
			subject => [
				`- Set the ${subject} preconditions: command, environment, source boundary, runtime input, and low-level behavior to inspect.`,
				`- Rerun after each meaningful change and keep one ordinary output plus one warning, trace, log, return code, or memory observation.`,
				`- Close ${subject} with a reproducibility note naming the assumption that would fail first in a different environment.`
			]
		]);
	}
	if (
		/\binput\/output\b/.test(source) &&
		!/\b(?:file|files|csv|parser|streams?|pipelines?)\b/.test(source)
	) {
		return variantLines(context, [
			subject => [
				`- For ${subject}, define which values are typed by the user, which values are stored, and which values are printed.`,
				`- Test ${subject} typical input, awkward input such as extra spaces or decimals when relevant, and output labels that make the result unambiguous.`,
				`- Keep ${subject} input collection, calculation, and printed output separated enough to debug each step.`
			],
			subject => [
				`- Map the ${subject} input prompt, stored variables, calculation step, and printed result before coding.`,
				`- Test ${subject} with ordinary input, blank or awkward input when relevant, and labels that explain the answer.`,
				`- Keep ${subject} prompts, conversions, calculations, and output formatting easy to inspect separately.`
			],
			subject => [
				`- State the ${subject} input type, variable name, conversion rule, and expected output format.`,
				`- Test ${subject} with one clean example and one example that could expose spacing, decimal, or type assumptions.`,
				`- Explain how ${subject} moves from user input to stored value to final printed sentence.`
			]
		]);
	}
	if (/c systems|systems build|assembly/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} build command, source/header boundary, runtime input, memory assumption, or observable system behavior before implementation.`,
				`- Verify ${subject} standard behavior and one failure path with compiler output, sanitizer output, return codes, logs, or command-line output.`,
				`- Record the command and evidence for ${subject} so the systems behavior can be reproduced from a clean checkout or shell.`
			],
			subject => [
				`- Name the ${subject} source files, build flags, entry point, and runtime state visible after the run.`,
				`- Check one successful run and one failure-mode run with terminal output, warning output, debugger output, or logs.`,
				`- Keep the ${subject} final evidence tied to a repeatable command rather than an IDE-only observation.`
			],
			subject => [
				`- State the ${subject} compile path, input fixture, memory or process assumption, and output that proves success.`,
				`- Use compiler diagnostics, return codes, command output, traces, or sanitizer output to compare expected and edge behavior.`,
				`- For ${subject}, record which boundary was tested: header/source split, lifetime, layout, process state, or machine behavior.`
			],
			subject => [
				`- Set up ${subject} with an explicit command, file boundary, expected output, and cleanup step if the run changes state.`,
				`- Verify a standard scenario, a boundary or malformed case, and one low-level symptom from logs, traces, warnings, or return codes.`,
				`- Explain how the ${subject} evidence supports the systems claim being practiced.`
			]
		]);
	}
	if (/\b(?:multi-file|source files?|headers?)\b/.test(source)) {
		return [
			"- Define which declarations belong in headers, which definitions belong in source files, and which file contains the runnable entry point.",
			"- Build from a clean compile command and verify that include paths, class boundaries, and linker behavior are understood.",
			"- Keep a short note naming one organization choice that made the program easier to extend or debug."
		];
	}
	if (isWebContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the visible ${subject} user flow and data flow before implementation.`,
				`- Verify ${subject} in the browser at desktop and narrow widths.`,
				`- Check ${subject} loading, empty, success, and error states instead of only the default path.`
			],
			subject => [
				`- Sketch the ${subject} screen state, user action, data source, and expected feedback before coding.`,
				`- Test ${subject} with a fresh browser load, keyboard navigation, and both narrow and wide layouts.`,
				`- Include ${subject} empty, loading, success, and failure behavior or explain why a state does not apply.`
			],
			subject => [
				`- Identify the ${subject} event, state update, rendering change, and data boundary before implementation.`,
				`- Check ${subject} on mobile-width and desktop-width screens with current console output visible.`,
				`- Verify ${subject} normal behavior plus one empty, error, validation, or slow-loading state.`
			],
			subject => [
				`- Map the ${subject} UI path from input or click through state, data, and rendered result.`,
				`- Run ${subject} from a clean page load and resize the viewport before accepting the result.`,
				`- Confirm ${subject} handles the standard case and at least one missing-data, invalid-input, or failed-request case.`
			],
			subject => [
				`- Define the ${subject} route or component, user action, state owner, and visible response before coding.`,
				`- Inspect browser output after a refresh and after one changed viewport or keyboard interaction.`,
				`- Include one non-ideal state such as missing input, invalid data, loading delay, failed request, or empty content.`
			],
			subject => [
				`- State how ${subject} moves from user input to state/data change to DOM, canvas, or API output.`,
				`- Test the main interaction in the browser, then repeat with one layout, validation, console, or network concern.`,
				`- Keep the final check tied to rendered behavior rather than only to code structure.`
			],
			subject => [
				`- Sketch ${subject} as a user-flow checklist: trigger, state change, rendered feedback, and failure feedback.`,
				`- Verify the clean-load path and one awkward path before adding polish.`,
				`- Record the browser evidence that confirms the behavior on the intended screen size or interaction mode.`
			],
			subject => [
				`- Name the ${subject} visible requirement, the source of data or state, and the UI feedback expected when it succeeds or fails.`,
				`- Use a current browser run to check ordinary behavior, an empty or invalid state, and one responsive or accessibility concern.`,
				`- Explain which event handler, state update, DOM/canvas operation, or request boundary controls the result.`
			]
		]);
	}
	if (/security|offensive|threat|network/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Work on ${subject} only against local fixtures, intentionally vulnerable examples, or owned test data.`,
				`- Write the ${subject} threat model or failure mode before running the lab.`,
				`- Finish ${subject} with evidence, impact, and a defensive mitigation or hardening step.`
			],
			subject => [
				`- Keep ${subject} inside the approved lab boundary: local services, provided fixtures, or systems you own and control.`,
				`- Name the ${subject} asset, trust boundary, and expected failure mode before collecting evidence.`,
				`- Close ${subject} with the captured evidence and one defensive action such as mitigation, detection, rollback, or hardening.`
			],
			subject => [
				`- Scope ${subject} to safe targets only, and do not generalize beyond the local fixture or owned environment.`,
				`- Capture ${subject} evidence from logs, requests, responses, traces, packets, configs, or command output before drawing a conclusion.`,
				`- State the impact in defensive terms and verify a safer configuration, detection, or remediation step.`
			],
			subject => [
				`- Define the allowed ${subject} target and stop condition before running commands or sending test traffic.`,
				`- Record what changed, what evidence was observed, and which assumption the lab tested.`,
				`- Finish with a concrete defensive result: a fixed setting, blocked path, alert, rollback plan, or verified no-regression check.`
			]
		]);
	}
	if (/binary search tree|\bbst\b/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} tree ordering invariant before implementing traversal or mutation.`,
				`- Test ${subject} with empty tree, root-only tree, left-branch, right-branch, missing-value, and duplicate-policy cases.`,
				`- Trace at least one ${subject} insert/search/remove path by recording each node comparison.`
			],
			subject => [
				`- State the ${subject} rule for values less than, greater than, and equal to the current node.`,
				`- Test ${subject} insertion, lookup, traversal order, and removal for leaf, one-child, and two-child cases when relevant.`,
				`- Explain how ${subject} preserves the binary-search-tree invariant after each mutation.`
			],
			subject => [
				`- Draw a small ${subject} tree before coding so parent, left child, and right child relationships are explicit.`,
				`- Test ${subject} with balanced-looking data, sorted insertion data, a missing value, and the chosen duplicate behavior.`,
				`- For ${subject}, record which recursive or iterative branch is taken during one traced operation.`
			]
		]);
	}
	if (/\bbinary search\b/.test(source)) {
		return [
			"- State the sorted-data precondition before coding.",
			`- Implement ${subject} so found, missing, first-half, and second-half targets are handled correctly.`,
			`- Trace at least one ${subject} search by recording the low, high, and middle indices at each step.`
		];
	}
	if (/linear search|sequential search/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Implement ${subject} so the result clearly reports found versus not found.`,
				`- Test ${subject} with the first item, last item, middle item, and a missing target.`,
				`- If the ${subject} data is sorted, explain when the search can stop early and why that is safe.`
			],
			subject => [
				`- Decide whether ${subject} returns a boolean, index, object, or sentinel value before coding.`,
				`- Test ${subject} with a target at the start, a target at the end, duplicates, and a value not present.`,
				`- Explain whether ${subject} must inspect every item or can stop early because of sorted order.`
			],
			subject => [
				`- Trace ${subject} by recording each compared element and the result returned.`,
				`- Test ${subject} with one-element data, ordinary data, and data where the answer is missing.`,
				`- Explain how ${subject} avoids confusing the value being searched for with its index.`
			]
		]);
	}
	if (/sort|selection|insertion|merge|quick/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Show the ${subject} array or list before and after the algorithm runs.`,
				`- Test ${subject} with already-sorted, reverse-sorted, duplicate-value, and small-size inputs.`,
				"- Explain whether comparisons, swaps, recursive splits, merges, or partitions account for most of the runtime."
			],
			subject => [
				`- Trace ${subject} on a tiny list so every comparison and movement can be checked by hand.`,
				`- Test ${subject} with sorted data, reverse-sorted data, duplicates, and a one-element or empty case where relevant.`,
				"- Identify the operation that repeats most often and connect it to the expected time complexity."
			],
			subject => [
				`- Record the ${subject} data before the run, after one important pass or recursive step, and after the final result.`,
				`- Check ${subject} with duplicate values, nearly sorted data, and a data layout that stresses the algorithm.`,
				"- Explain the best-case or worst-case data layout when the algorithm has one."
			],
			subject => [
				`- Use ${subject} to make the algorithm state visible: current index, partition, sorted prefix, temporary array, or merge window.`,
				`- Test ${subject} with small, ordinary, already-ordered, and reverse-ordered inputs.`,
				"- Compare the number of passes, recursive levels, or element moves with the runtime claim."
			]
		]);
	}
	if (/array|matrix|grid|two-dimensional|2d/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Use a small visible ${subject} example so row and column positions can be traced.`,
				`- Test ${subject} with first row, last row, first column, last column, and an interior position.`,
				`- Explain how the ${subject} loop bounds prevent out-of-range indexing.`
			],
			subject => [
				`- Sketch the ${subject} indices before coding so row, column, and length relationships are explicit.`,
				`- Test ${subject} with an empty or smallest useful structure, a full structure, and one middle position.`,
				`- For ${subject}, explain which loop variable controls rows, columns, or element positions.`
			],
			subject => [
				`- Show the ${subject} data before and after the operation so changes are visible.`,
				`- Test ${subject} at index 0, the final valid index, and one value that is out of bounds.`,
				`- Explain how the ${subject} traversal avoids skipping elements or reading beyond the structure.`
			],
			subject => [
				`- Choose a compact ${subject} sample that can be traced by hand.`,
				`- Test ${subject} with duplicate values, a boundary position, and one case that leaves the structure unchanged.`,
				`- Explain whether ${subject} uses indices, enhanced iteration, nested loops, or helper methods and why.`
			]
		]);
	}
	if (/dictionary|map|hash|set/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Demonstrate ${subject} adding, reading, updating, and checking for a missing key or value.`,
				`- Print or inspect the ${subject} data structure after each important change.`,
				`- Explain why the chosen ${subject} structure is better than a plain list for this task.`
			],
			subject => [
				`- Define the ${subject} keys or priority values before writing update logic.`,
				`- Test ${subject} with a new entry, repeated entry, missing lookup, and changed value.`,
				`- Explain how ${subject} lookup or ordering changes the algorithm compared with scanning a list.`
			],
			subject => [
				`- Show the ${subject} structure before and after every operation that changes membership or priority.`,
				`- Test ${subject} with duplicate data, absent data, and the smallest useful collection.`,
				`- For ${subject}, explain which operation controls correctness: insertion, lookup, update, removal, or ordering.`
			]
		]);
	}
	if (/\b(?:calendar machine|date|dates|time|times)\b/.test(source)) {
		return [
			"- Define the conversion assumptions clearly before coding.",
			"- Print the result in labeled units so the output is not ambiguous.",
			"- Test zero days, a small number of days, and a value large enough to use every unit."
		];
	}
	if (/cipher|encode|decode|secret|message/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Preserve or intentionally transform ${subject} spaces, punctuation, and letter case according to the spec.`,
				`- Test ${subject} wraparound at the beginning and end of the alphabet.`,
				`- Include one ${subject} encode/decode round trip that returns the original message.`
			],
			subject => [
				`- Define how ${subject} handles letters, nonletters, uppercase text, lowercase text, and empty input.`,
				`- Test ${subject} with a normal word, a phrase with spaces, punctuation, and an alphabet boundary case.`,
				`- Explain how ${subject} maps between characters, codes, or shifted positions.`
			],
			subject => [
				`- State the ${subject} encoding rule before writing helper methods or loops.`,
				`- Test ${subject} with lowercase, uppercase, symbols, and a message that returns unchanged.`,
				`- Verify ${subject} by decoding an encoded message and comparing it with the starting text.`
			]
		]);
	}
	if (/\b(?:file|files|parser|csv|json|io|i\/o)\b/.test(source)) {
		return [
			`- Identify the expected file format for ${subject} and how malformed or missing data will be handled.`,
			`- Test ${subject} with at least one normal file and one awkward file with an empty line or incomplete record.`,
			`- Keep ${subject} parsing, validation, and output formatting separated enough to debug each part.`
		];
	}
	if (/pointer|address|dynamic memory|raw array|memory/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Draw or annotate the ${subject} relationship between values, addresses, and ownership before coding.`,
				`- Test ${subject} allocation, access, resizing or cleanup behavior, and an empty or one-element case.`,
				`- For ${subject}, explain which object owns each resource and when that resource is released.`
			],
			subject => [
				`- State the ${subject} owner, borrowed reference, pointer target, or array extent before writing memory-sensitive code.`,
				`- Test ${subject} with null or empty state, one element, normal size, and cleanup or transfer behavior where relevant.`,
				`- Explain how ${subject} avoids leaks, dangling access, out-of-bounds access, or unclear ownership.`
			],
			subject => [
				`- Sketch the ${subject} stack/heap or object-lifetime picture before changing pointer or allocation logic.`,
				`- Test ${subject} construction, mutation, copy or move behavior, and destruction or reset behavior when relevant.`,
				`- Record the ${subject} lifetime rule that determines when a value remains valid.`
			]
		]);
	}
	if (isApcsContext(context)) {
		return variantLines(context, [
			subject => [
				`- Identify the ${subject} Java concept being practiced, the relevant variables or object state, and the expected output or method result.`,
				`- Compile and run ${subject}, then test a normal AP-style case plus one edge case involving a boundary value, empty collection, null-risk, or branch change when relevant.`,
				`- Include a short ${subject} trace, state table, or explanation of why the selected Java construct behaves that way.`
			],
			() => [
				"- Name the AP Java target: type behavior, expression evaluation, control flow, method call, class state, array, or list operation.",
				`- Check a routine case and one case shaped like an AP distractor, such as off-by-one indexing, integer division, equality, aliasing, or mutation.`,
				`- Record the exact Java rule that justifies the result.`
			],
			subject => [
				`- State the ${subject} preconditions, important variable values, object state, and expected console output or return value.`,
				`- Run or trace one ordinary example and one boundary example before comparing with the solution.`,
				`- Explain the answer using AP vocabulary such as primitive, reference, condition, loop invariant, parameter, or list index where relevant.`
			],
			subject => [
				`- Map ${subject} to the AP concept being assessed and the smallest code fragment that proves it.`,
				`- Verify the main path plus one changed value, branch condition, loop bound, method input, or collection size.`,
				`- Keep the reasoning note focused on why Java produces that result, not only what the output is.`
			],
			subject => [
				`- For ${subject}, identify which statement, method, constructor, array access, list call, or class relationship controls the answer.`,
				`- Test or trace a standard example, a boundary example, and one example likely to catch a common AP misconception.`,
				`- Summarize the scoring-relevant reasoning in one compact explanation.`
			]
		]);
	}
	if (isPythonTurtleContext(context)) {
		return variantLines(context, [
			subject => [
				`- Plan ${subject} as visible canvas behavior: setup, turtle objects, movement or turn commands, repeated patterns or helper functions, and the expected drawing or game state.`,
				`- Run ${subject} from a clean start and check a normal canvas path plus one boundary case such as a smallest shape, screen edge, repeated action, or reset when relevant.`,
				`- Keep ${subject} explainable by separating canvas setup, turtle state, movement logic, and visible feedback.`
			],
			subject => [
				`- For ${subject}, identify the turtle setup, coordinate or movement rule, loop or helper boundary, and the visible result that should appear on the canvas.`,
				`- Test ${subject} with an ordinary drawing path, a smallest useful drawing or movement path, and one edge case such as pen state, screen boundary, repeated key press, or color/fill change.`,
				`- Keep ${subject} organized so canvas setup, turtle commands, reusable helpers, and final visual feedback can be debugged separately.`
			],
			subject => [
				`- Turn ${subject} into a small Turtle plan: canvas setup, turtle state, movement sequence, repeated logic, and evidence from the final drawing or animation.`,
				`- Check ${subject} with a representative visual path, a boundary path near the canvas edge, and one state change such as pen up/down, color, score, or reset.`,
				`- Keep the final ${subject} explanation tied to the coordinate rule, event callback, loop, function, or collision check that drives the result.`
			],
			subject => [
				`- Before coding ${subject}, describe the expected starting state, turtle objects, key movement commands, and final visible result.`,
				`- Begin with a tiny traceable drawing or movement, then add the standard version and one edge case that could go offscreen, repeat incorrectly, or leave the pen in the wrong state.`,
				`- Keep ${subject} readable enough that the canvas behavior can be followed without rereading every line.`
			]
		]);
	}
	if (/python/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Name the input values, helper functions or loops, data structures, and printed output for ${subject} before coding.`,
				`- Test ${subject} with one standard scenario, one empty or smallest case, and one edge input such as extra spaces, casing, duplicates, or invalid data when relevant.`,
				`- Keep ${subject} explainable by separating input handling, core logic, and output formatting.`
			],
			subject => [
				`- For ${subject}, identify the input surface, transformation step, helper boundary, collection or file shape, and expected output.`,
				`- Run ${subject} with a typical case, a smallest or empty case, and one awkward input that can be traced by hand.`,
				`- Keep ${subject} input parsing, core logic, and final formatting separate enough to debug one layer at a time.`
			],
			subject => [
				`- Turn ${subject} into a small Python data-flow plan: input, stored values, loop or function, output, and evidence.`,
				`- Check ${subject} with a standard path, a boundary path, and one surprising input such as punctuation, casing, duplicates, or missing data.`,
				`- Keep the final ${subject} explanation tied to the function, loop, list, dictionary, file, or algorithm that drives the result.`
			],
			subject => [
				`- Before coding ${subject}, write the expected input, intermediate state, helper function role, and final printed or saved result.`,
				`- Begin with a tiny traceable case, then add one standard case and one edge or invalid case.`,
				`- Keep the ${subject} implementation readable enough that the data flow can be followed without rereading every line.`
			],
			subject => [
				`- State the ${subject} accepted data, output form, important variables, and helper or loop responsibility before coding.`,
				`- Run a compact hand-checkable case, then compare it with a representative case and one malformed or surprising case.`,
				`- For ${subject}, explain which branch, loop, helper, collection, or file step controls the result.`
			],
			subject => [
				`- Break ${subject} into setup, input handling, core transformation, and visible output before implementation.`,
				`- Test the smallest meaningful data, ordinary data, and one case involving missing values, duplicates, casing, or punctuation.`,
				`- Keep the ${subject} explanation focused on how data moves through the program.`
			],
			subject => [
				`- Write one ${subject} example with exact input, important intermediate values, and expected output before adding general logic.`,
				`- Add one condition, loop, helper, list, dictionary, or file operation to ${subject} at a time and rerun with labeled evidence.`,
				`- Record the ${subject} assumption most likely to fail when input format or data size changes.`
			],
			subject => [
				`- Identify the ${subject} user input or file data, validation rule, processing step, and output format.`,
				`- Compare a standard ${subject} run with an empty, smallest, duplicate, messy, or invalid run that exercises a different path.`,
				`- Keep ${subject} parsing, computation, and presentation distinct enough that a bug can be isolated to one layer.`
			]
		]);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the classes, object state, method inputs, return values, and expected console or test output for ${subject}.`,
				`- Compile and run ${subject} after meaningful class or method changes, then test one standard scenario and one edge case.`,
				`- Keep a short ${subject} note naming the class responsibility, verified method, and important object-state change.`
			],
			subject => [
				`- Map ${subject} to Java types, fields, methods, parameters, return values, and visible output before coding.`,
				`- Use short compile/run cycles in ${subject} so syntax, type, and object-state errors stay easy to isolate.`,
				`- Record the ${subject} standard scenario, edge case, and class or method responsibility being verified.`
			],
			subject => [
				`- Identify the ${subject} class that owns the behavior, the stored state it uses, and the expected output or assertion.`,
				`- Add one constructor, branch, method, or collection operation to ${subject} at a time, compiling between meaningful changes.`,
				`- Keep a short verification note for ${subject} on the object-state change, equality check, access boundary, or dispatch rule that matters most.`
			],
			subject => [
				`- Turn ${subject} into a concrete Java contract: inputs, object state, return values, side effects, and evidence.`,
				`- Build ${subject} in small runnable slices and check output, tests, or traces before adding the next behavior.`,
				`- Include one ${subject} standard path, one edge path, and one note about the relevant type or API boundary.`
			],
			subject => [
				`- Start ${subject} by naming the class boundary, stored data, method contract, and expected result.`,
				`- Compile ${subject} after each field, constructor, branch, or collection change so type errors stay tied to the recent edit.`,
				`- Record one ordinary ${subject} run, one boundary run, and the Java rule that explains the outcome.`
			],
			subject => [
				`- Describe ${subject} as a Java object model before coding: responsibilities, collaborators, public calls, and evidence.`,
				`- Add ${subject} behavior in compilable increments, checking constructor setup, method calls, and any collection mutation as they appear.`,
				`- Keep the ${subject} verification note focused on the design boundary that made the implementation easier to reason about.`
			],
			subject => [
				`- Identify the ${subject} type choices, access levels, method signatures, and expected console or test evidence.`,
				`- Build a minimal passing version first, then add the branch, overload, override, record, or list case that carries the concept.`,
				`- Compare a typical case with a deliberately challenging case and state which Java feature handled the difference.`
			],
			subject => [
				`- Before implementing ${subject}, write the object state, public behavior, and one example method call with its expected result.`,
				`- Keep each compile/run cycle tied to one change in state, control flow, collection behavior, or method dispatch.`,
				`- Finish with evidence that separates syntax correctness from the design decision being practiced.`
			],
			subject => [
				`- Write the ${subject} class contract as state, public calls, return values, side effects, and expected evidence.`,
				`- Implement fields, constructors, methods, branches, and collection changes for ${subject} in slices that compile independently.`,
				`- Compare one routine object state in ${subject} with one boundary or edge state and explain the Java rule involved.`
			],
			subject => [
				`- Decide whether ${subject} belongs in a class, record, interface, helper method, or collection workflow before coding.`,
				`- Keep a small driver, trace, or test available after every constructor, method, loop, or dispatch change.`,
				`- Record the boundary between syntax issues and object-design issues in the final check.`
			],
			subject => [
				`- Sketch the ${subject} object relationships, access levels, method signatures, and evidence needed for the result.`,
				`- Build the core behavior for ${subject} first, then add the branch, overload, override, record, interface, or list behavior that carries the concept.`,
				`- Check a typical case, an edge case, and one case that changes object state or collaboration.`
			],
			subject => [
				`- Start ${subject} from a concrete example call or object diagram, then generalize the class behavior.`,
				`- Compile ${subject} after each public contract change and rerun the smallest example before adding another path.`,
				`- State which ${subject} type, method, or collection owns the most important responsibility.`
			],
			subject => [
				`- Separate ${subject} model behavior from console, runner, or test harness behavior before adding extra features.`,
				`- Verify ${subject} constructor state, method output, and one edge input or object transition while the code still compiles cleanly.`,
				`- Explain which Java feature makes the final behavior reliable.`
			]
		]);
	}
	if (/c\+\+|cpp/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} data representation, ownership or lifetime assumptions, compile command, and expected output.`,
				`- Build ${subject} with warnings enabled when possible and test one standard scenario, one boundary case, and one malformed or edge input.`,
				`- Record the ${subject} container, pointer/reference, or memory decision that most affects correctness.`
			],
			subject => [
				`- State the ${subject} types, invariants, ownership rule, and command needed to reproduce the run.`,
				`- Check ${subject} with a small ordinary input, an edge input, and one case that stresses copying, bounds, null state, or lifetime.`,
				`- Keep the ${subject} verification note tied to compiler output, runtime output, sanitizer output, or a traceable data change.`
			],
			subject => [
				`- Map ${subject} to its object, pointer, array, vector, or file representation before implementing behavior.`,
				`- Rebuild after each API, allocation, loop, branch, or data-structure change so failures stay local.`,
				`- Explain the ${subject} result through one concrete resource, container, reference, or complexity decision.`
			],
			subject => [
				`- Identify the ${subject} input contract, output contract, build flags, and resource boundary before writing code.`,
				`- Verify a clean run, a smallest or empty run, and one invalid or stress-shaped run with current output.`,
				`- For ${subject}, record which assumption would break first if the program became larger.`
			],
			subject => [
				`- Separate ${subject} setup, data ownership, mutation behavior, and output formatting before adding extra features.`,
				`- Run a representative case, a boundary case, and one diagnostic check such as warnings, debugger inspection, or sanitizer output.`,
				`- Name the ${subject} decision that made the code safer or easier to reason about.`
			],
			subject => [
				`- Write the ${subject} preconditions, postconditions, compile command, and relevant memory or container state before coding.`,
				`- Build the smallest runnable path first, then add one behavior at a time with a rerun after each meaningful edit.`,
				`- Close ${subject} by comparing expected state with observed state for a standard case and a deliberately challenging case.`
			]
		]);
	}
	if (isMathContext(context)) {
		return variantLines(context, [
			() => [
				"- State the givens, target quantity, representation, and rule or theorem before solving.",
				"- Work a typical example, then check a boundary, sign, unit, graph, or table case that could change the interpretation.",
				"- Keep each algebraic or representational step justified so the final answer can be checked for reasonableness."
			],
			() => [
				"- Identify the known values, unknown value, and representation before choosing a method.",
				"- Test one standard case and one case involving sign, intercept, domain, unit, or graph behavior.",
				"- Explain how the answer can be checked without simply repeating the same calculation."
			],
			() => [
				"- Translate the situation into an equation, graph, table, diagram, or verbal model before solving.",
				"- Check the result with a substitution, estimate, graph feature, boundary value, or unit/context test.",
				"- Record why each transformation is valid so the result is auditable."
			]
		]);
	}
	if (isScienceContext(context)) {
		return [
			"- Use a provided image, graph, data table, short video, or simulation rather than required physical supplies.",
			"- Record observations before explaining them.",
			"- Finish with a claim, evidence, and reasoning response using the target vocabulary."
		];
	}

	return [
		"- Define the intended result, inputs or materials, and success criteria before starting.",
		"- Complete the smallest working version first, then check a typical case and one boundary or unusual case.",
		"- Keep the final result explainable by naming the main reasoning or design choice and the evidence that supports it."
	];
}

function completionChecks(context: CourseTextContext) {
	const source = contextText(context);
	const subject = extensionSubject(context);

	if (isCompetitiveProgrammingContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} solution passes the sample input/output exactly.`,
				`- Test ${subject} with a smallest-case input, a largest-reasonable input, and a tie or duplicate case when relevant.`,
				`- State the ${subject} time complexity and why it fits the expected constraints.`
			],
			subject => [
				`- ${subject} matches the required input/output format and sample result without extra prompts or formatting.`,
				`- A hand-traced ${subject} case, a boundary case, and a duplicate, tie, or ordering case are checked when relevant.`,
				`- Record the ${subject} invariant and the complexity bound that makes the approach acceptable.`
			],
			subject => [
				`- ${subject} produces exactly the expected output for the sample and for at least one custom test.`,
				`- The checked ${subject} tests include a minimal case and one case shaped by the largest constraint or a tricky ordering condition.`,
				`- The final ${subject} explanation connects the algorithm idea to its runtime and memory use.`
			],
			subject => [
				`- ${subject} can be run with contest-style input and no manual interaction beyond the input file or stdin.`,
				`- The sample, one tiny case, and one edge or adversarial case agree with the hand reasoning.`,
				`- The closing ${subject} note records the invariant, complexity class, and the edge case most likely to break a weaker solution.`
			]
		]);
	}
	if (isScratchSource(source)) {
		return variantLines(context, [
			subject => [
				`- ${subject} starts from a predictable green-flag state.`,
				`- ${subject} controls, events, broadcasts, variables, and sprite interactions behave as intended.`,
				`- The ${subject} explanation names the main state change and one edge case tested during play.`
			],
			subject => [
				`- ${subject} has a clear start state, main interaction, feedback moment, and end or reset behavior.`,
				`- ${subject} events, variables, costumes or backdrops, broadcasts, and clones are checked where they apply.`,
				`- The ${subject} explanation connects one player action to the blocks that change the stage.`
			],
			subject => [
				`- ${subject} can be replayed without stale score, position, costume, or clone state.`,
				`- ${subject} handles normal play and one boundary case such as timer end, collision, missed input, or repeated click.`,
				`- Record the ${subject} state variable or event chain most responsible for correctness.`
			]
		]);
	}
	if (isUnityContext(context)) {
		return [
			`- The ${subject} scene starts from a predictable state and the main interaction is visible during play mode.`,
			`- ${subject} controls, collisions or interactions, scoring/progress, and reset or completion behavior are checked.`,
			`- Record the ${subject} script, prefab, or scene setting that most directly controls the behavior.`
		];
	}
	if (isPygameSource(source)) {
		return [
			`- ${subject} starts from a predictable game state and can be restarted or ended intentionally.`,
			`- ${subject} actor updates, input events, collisions, score/health changes, and draw order are verified with at least one normal and boundary case.`,
			`- The final ${subject} explanation names the game loop, the most important state variable, and one bug or edge case found during playtesting.`
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return variantLines(context, [
			subject => [
				`- ${subject} builds and launches on the intended simulator or device target.`,
				`- ${subject} state changes, navigation, layout, loading/error behavior, signing, or release workflow evidence is captured as appropriate.`,
				`- The final ${subject} note separates code behavior from Xcode/project configuration behavior.`
			],
			subject => [
				`- ${subject} has current preview, simulator, build, or device evidence for the target app path.`,
				`- ${subject} checks one normal interaction plus one empty, invalid, layout, navigation, or accessibility condition.`,
				`- Record whether the ${subject} issue was view code, state flow, configuration, signing, or target setup.`
			],
			subject => [
				`- ${subject} runs from a clean launch and reaches the expected screen or app state.`,
				`- ${subject} verifies state, navigation, persistence, layout, loading, error, or accessibility behavior where relevant.`,
				`- The closing ${subject} note names the Swift, SwiftUI, project, simulator, or release setting that mattered.`
			],
			subject => [
				`- ${subject} records the target, build result, simulator or device state, and visible behavior used for verification.`,
				`- ${subject} includes one ordinary path and one edge path such as empty data, invalid input, offline state, or layout stress.`,
				`- The final ${subject} note connects the app behavior to the state owner or project configuration.`
			]
		]);
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return [
			"- Commands are repeatable from a fresh shell or documented starting state.",
			`- ${subject} file, permission, process, service, timer, network, or log evidence confirms the intended system state.`,
			`- The final ${subject} note includes one failure mode, rollback step, or diagnostic command that would help future troubleshooting.`
		];
	}
	if (isLowLevelSystemsContext(context)) {
		return variantLines(context, [
			subject => [
				`- ${subject} builds from the documented command or toolchain setting.`,
				`- ${subject} compiler output, sanitizer output, register or memory evidence, return codes, logs, or command-line output confirms the intended behavior.`,
				`- The final ${subject} note includes one failure mode, debugging command, or reproducibility detail that would help future troubleshooting.`
			],
			subject => [
				`- ${subject} has a repeatable build/run command and a known starting state.`,
				`- ${subject} evidence includes one relevant compiler, debugger, sanitizer, trace, log, register, memory, or return-code observation.`,
				`- Record the ${subject} boundary or assumption that would be easiest to break.`
			],
			subject => [
				`- ${subject} can be rebuilt from a clean checkout or shell without relying on hidden IDE state.`,
				`- ${subject} confirms behavior with terminal output plus one low-level observation such as memory layout, register state, sanitizer output, or logs.`,
				`- The final ${subject} note records the command and one troubleshooting clue for a future rerun.`
			],
			subject => [
				`- ${subject} documents the exact command, toolchain, target, or simulator state used for verification.`,
				`- ${subject} checks expected behavior and one failure-mode behavior with concrete output or diagnostic evidence.`,
				`- Record the ${subject} resource, lifetime, representation, or command assumption that mattered.`
			]
		]);
	}
	if (isNetworkSystemsContext(context, source)) {
		return [
			`- The ${subject} topology, host roles, addresses, ports, protocols, or firewall boundaries are named explicitly.`,
			`- ${subject} diagnostic evidence shows both expected behavior and at least one failure or blocked-path condition.`,
			`- The final ${subject} explanation connects the observed packet, port, DNS, route, or service result to the network model.`
		];
	}
	if (isScienceContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} explanation names the phenomenon, model or data source, and target vocabulary.`,
				"- Separate observation from inference.",
				"- The final response connects the claim to evidence and explains the scientific reasoning."
			],
			subject => [
				`- ${subject} identifies what was observed, what was inferred, and which model or evidence source supports the claim.`,
				`- The ${subject} vocabulary is used to explain the evidence rather than only label it.`,
				`- The final ${subject} response connects claim, evidence, and reasoning in a complete sentence or labeled diagram.`
			],
			subject => [
				`- The ${subject} response names the data, simulation, image, reading, or graph used as evidence.`,
				`- ${subject} observations, patterns, and explanations are kept distinct.`,
				`- The ${subject} reasoning explains why the evidence supports the claim and where the model may be limited.`
			],
			subject => [
				`- ${subject} includes a clear phenomenon, a relevant model or data source, and one target term used correctly.`,
				`- At least one ${subject} observation is separated from the conclusion drawn from it.`,
				`- The final ${subject} answer states the claim, cites evidence, and explains the scientific connection.`
			],
			subject => [
				`- ${subject} names the system being studied, the evidence source, and the vocabulary needed to describe it.`,
				`- Observations, measurements, or patterns are recorded before the explanation is chosen.`,
				`- The conclusion explains why the evidence supports the claim and what the model leaves out.`
			],
			subject => [
				`- The ${subject} response distinguishes data, model, pattern, and interpretation.`,
				`- Target vocabulary is used in context, with at least one sentence or diagram showing the relationship between ideas.`,
				`- The answer includes a defensible claim plus evidence that can be pointed to in the image, graph, simulation, reading, or dataset.`
			],
			subject => [
				`- ${subject} identifies the relevant variables, observable pattern, and model or diagram used to explain the pattern.`,
				`- The response states what is directly observed and what is inferred from prior science knowledge.`,
				`- The reasoning explains the connection between the evidence and the vocabulary, not just the final conclusion.`
			],
			subject => [
				`- The ${subject} work uses a simulation, graph, image, reading, or dataset as evidence rather than unsupported opinion.`,
				`- Include one limitation, uncertainty, or alternate explanation when the model is incomplete.`,
				`- Make the final statement clear about the supported claim and the evidence behind it.`
			],
			subject => [
				`- ${subject} points to a specific observation, measurement, diagram feature, graph pattern, or simulation result.`,
				`- The claim avoids going beyond the evidence that was actually provided.`,
				`- The reasoning explains how the science vocabulary links the evidence to the conclusion.`
			],
			subject => [
				`- The ${subject} response names the source of evidence and the feature of that source that matters most.`,
				`- A model limitation, uncertainty, or missing variable is stated when the evidence is incomplete.`,
				`- The conclusion connects the observed pattern to the relevant concept in a way another reader can check.`
			],
			subject => [
				`- ${subject} separates what the source shows from what the explanation claims.`,
				`- The response includes at least one concrete evidence phrase from a graph, image, table, reading, or simulation.`,
				`- The reasoning sentence explains why that evidence supports the claim instead of only restating the claim.`
			],
			subject => [
				`- The ${subject} work identifies the phenomenon, evidence source, and target term before writing the claim.`,
				`- The ${subject} answer includes one check against overclaiming, such as a limitation, alternate cause, or missing measurement.`,
				`- The final ${subject} explanation links evidence, vocabulary, and model behavior in a reviewable way.`
			]
		]);
	}
	if (isMathContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} solution shows the rule, representation, or theorem used.`,
				`- A typical ${subject} case and a sign, unit, graph, table, or boundary check are included when relevant.`,
				`- The final ${subject} answer is checked for reasonableness in context.`
			],
			subject => [
				`- ${subject} includes the formula, operator rule, geometric relationship, or algebraic move that justifies the result.`,
				`- ${subject} is checked with one ordinary input and one edge case involving sign, rounding, units, graph shape, or table values.`,
				`- The final ${subject} explanation states why the numerical result makes sense for the situation.`
			],
			subject => [
				`- ${subject} separates setup, computation, and interpretation so a reader can trace the reasoning.`,
				`- ${subject} includes at least one verification check such as substitution, estimation, inverse operation, graph/table comparison, or unit analysis.`,
				`- Record the ${subject} condition that would make the answer invalid or incomplete.`
			]
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} result is checked against a small trace, baseline, metric, visualization, or sanity check.`,
				`- ${subject} includes a standard case and a boundary or failure-mode case that is tested or explained.`,
				`- The ${subject} explanation states what the evidence supports and one limitation of the result.`
			],
			subject => [
				`- ${subject} has an explicit success signal, comparison point, or expected trace.`,
				`- ${subject} is tested on a hand-checkable input and a realistic input before conclusions are accepted.`,
				`- The final ${subject} note separates observed behavior from interpretation and limitation.`
			],
			subject => [
				`- ${subject} evidence includes either a trace, metric, baseline, visualization, or reasoned counterexample.`,
				`- ${subject} explains one case where the method works and one case where it could fail or mislead.`,
				`- The ${subject} conclusion is limited to what the evidence actually supports.`
			]
		]);
	}
	if (isApcsContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} Java code compiles and the target behavior is visible in output, tests, or a completed trace.`,
				`- ${subject} checks a standard scenario and an edge case for the relevant branch, loop, method, class, array, or list behavior.`,
				`- The ${subject} explanation uses precise Java vocabulary instead of only describing what the program appears to print.`
			],
			subject => [
				`- ${subject} has a fresh compile/run result with the expected console output, method return value, or trace recorded.`,
				`- ${subject} verifies the main AP Java construct plus one boundary case involving branches, loops, methods, arrays, lists, or objects.`,
				`- The ${subject} note names the Java rule that explains the result, not just the visible output.`
			],
			subject => [
				`- ${subject} can be rebuilt from a clean Java run and still shows the required behavior.`,
				`- ${subject} includes a typical case, an edge case, and one traceable step tied to the AP concept.`,
				`- The ${subject} explanation connects the result to the relevant type, control-flow, collection, class, or method vocabulary.`
			],
			subject => [
				`- ${subject} records current evidence from compilation, output, tests, or a completed hand trace.`,
				`- ${subject} checks ordinary behavior and one case likely to expose an AP-style off-by-one, equality, state, or indexing mistake.`,
				`- The final ${subject} note states the vocabulary and reasoning needed to defend the answer.`
			]
		]);
	}
	if (isWebContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} feature works from a fresh page load without relying on hidden state.`,
				`- ${subject} empty, loading, success, and failure states are visible or intentionally handled.`,
				`- The ${subject} page remains readable and usable on mobile and desktop widths.`
			],
			subject => [
				`- ${subject} can be reproduced after refresh with the same observable result or clear error feedback.`,
				`- ${subject} handles the ordinary state plus one empty, invalid, loading, or failed state.`,
				`- The interface remains usable with keyboard focus and at both narrow and wide viewport sizes.`
			],
			subject => [
				`- ${subject} shows the required state change, output, validation message, or rendered canvas behavior.`,
				`- A clean-load check and one non-ideal state are recorded before the work is considered complete.`,
				`- Layout, spacing, and interaction remain understandable on mobile and desktop screens.`
			],
			subject => [
				`- ${subject} connects the user action, state/data update, and final screen feedback without hidden setup.`,
				`- Missing data, invalid input, slow loading, or failed requests are handled intentionally when relevant.`,
				`- The final check includes browser evidence at more than one screen width.`
			],
			subject => [
				`- ${subject} demonstrates the required browser behavior after a refresh, not only in source code.`,
				`- The check includes the ordinary interaction plus one empty, invalid, failed, or delayed state when relevant.`,
				`- The page remains understandable with keyboard use and at a narrow or wide viewport.`
			],
			subject => [
				`- ${subject} ties the event, state change, rendered output, and user feedback together in the page.`,
				`- At least one non-happy path is exercised, such as missing input, invalid input, unavailable data, or a failed request.`,
				`- Browser evidence includes layout, console, network, accessibility, or responsive behavior where it matters.`
			],
			subject => [
				`- ${subject} reaches the expected observable result from a clean page load.`,
				`- A changed input, empty state, validation path, or error path is checked before the task is complete.`,
				`- The final review names the DOM, canvas, state, or API boundary that controlled the result.`
			],
			subject => [
				`- ${subject} is verified through the rendered page with current browser evidence.`,
				`- The result is checked at more than one screen width or interaction mode when layout or keyboard use matters.`,
				`- The completion note separates event handling, data/state update, rendering, and error feedback.`
			]
		]);
	}
	if (isPythonTurtleContext(context)) {
		return variantLines(context, [
			subject => [
				`- ${subject} can be rerun from a clean start and produces the expected drawing, animation, stamp, score, or game state.`,
				`- ${subject} checks an ordinary canvas path and one boundary path such as a smallest shape, offscreen move, collision edge, color/pen state, or reset.`,
				`- The ${subject} explanation names the turtle state, loop, helper, event callback, collision check, or coordinate rule that controls the result.`
			],
			subject => [
				`- ${subject} produces the expected visual result from a fresh run, not from hidden interpreter or canvas state.`,
				`- ${subject} checks a typical drawing or game path, a smallest useful path, and one edge case involving screen position, event timing, pen state, or reset behavior.`,
				`- The ${subject} explanation names the setup, turtle command, helper function, loop, event callback, or canvas coordinate rule that controls the result.`
			],
			subject => [
				`- ${subject} includes enough visible canvas evidence, comments, or trace notes to follow the Turtle state change.`,
				`- ${subject} checks the intended visual case, a minimal drawing or movement case, and one case that challenges a coordinate, pen, color, score, or collision assumption.`,
				`- Record the Python or Turtle construct that made the result easier to reason about.`
			],
			subject => [
				`- ${subject} produces reproducible visual evidence from the current code, not a previous canvas run.`,
				`- ${subject} checks one clean visual path, one canvas-boundary path, and one state issue such as repeated actions, key presses, color changes, or pen control.`,
				`- The closing ${subject} note separates setup, movement/state logic, and visible feedback decisions.`
			]
		]);
	}
	if (/python/.test(source)) {
		return variantLines(context, [
			subject => [
				`- ${subject} can be rerun cleanly with predictable output.`,
				`- ${subject} has normal, empty or smallest, and awkward inputs tested or justified.`,
				`- The ${subject} explanation names the input path, helper function, loop, collection, or file step that controls the result.`
			],
			subject => [
				`- ${subject} produces the expected output from a fresh run, not from hidden interpreter state.`,
				`- ${subject} checks a typical case, a smallest or empty case, and one awkward input.`,
				`- The ${subject} explanation names the input handling, helper function, loop, collection, or file step that controls the result.`
			],
			subject => [
				`- ${subject} includes enough output, trace, test, or saved data to verify the result.`,
				`- ${subject} checks normal behavior and one boundary or malformed-input behavior.`,
				`- The ${subject} explanation separates data flow from formatting or display choices.`
			],
			subject => [
				`- ${subject} runs from a clean start and the result can be reproduced with the recorded inputs.`,
				`- ${subject} tests or explains at least one ordinary input, one minimal input, and one awkward input.`,
				`- Record the ${subject} function, loop, data structure, or algorithm decision that mattered.`
			],
			subject => [
				`- ${subject} has a fresh run, trace, or test result for the current version of the code.`,
				`- ${subject} is checked with representative data, smallest useful data, and one surprising or malformed input.`,
				`- Record the ${subject} helper, branch, loop, collection, or file rule that controlled correctness.`
			],
			subject => [
				`- ${subject} can be rerun from the documented input and produces the same observable result.`,
				`- ${subject} covers an ordinary path, a boundary path, and one path involving missing, duplicate, or oddly formatted data.`,
				`- The ${subject} explanation connects the output to a specific function, condition, loop, or data structure.`
			],
			subject => [
				`- ${subject} includes enough labeled output or test evidence to follow the data flow.`,
				`- ${subject} checks the intended case, a minimal case, and one case that challenges an input or state assumption.`,
				"- Record the Python construct that made the result easier to reason about."
			],
			subject => [
				`- ${subject} produces reproducible evidence from the current code, not a previous interpreter run.`,
				`- ${subject} tests one clean input, one edge input, and one messy input such as spacing, casing, duplicates, or invalid data.`,
				`- The closing ${subject} note separates parsing, computation, and formatting decisions.`
			]
		]);
	}
	if (isJavaContext(context)) {
		return variantLines(context, [
			subject => [
				`- ${subject} compiles from a clean run and shows the intended behavior through output, tests, or method calls.`,
				`- ${subject} checks object construction, method behavior, and at least one edge case.`,
				`- The ${subject} explanation names the class or interface boundary that keeps the design understandable.`
			],
			subject => [
				`- ${subject} has a fresh compile/run check with the expected output or test result recorded.`,
				`- ${subject} checks a standard scenario, edge case, and object-state or method-dispatch case.`,
				`- The ${subject} explanation identifies which class, method, interface, or record owns the key responsibility.`
			],
			subject => [
				`- ${subject} demonstrates the target Java behavior from a clean start, not only from an already-warmed session.`,
				`- ${subject} verifies constructor behavior, method return values, and one boundary condition.`,
				`- The ${subject} explanation connects the result to a specific type, object, collection, or access-boundary choice.`
			],
			subject => [
				`- ${subject} includes current compile evidence and one visible output, trace, assertion, or test result.`,
				`- ${subject} checks a typical path and a deliberately awkward or boundary path.`,
				`- The ${subject} explanation separates syntax, object state, and public API behavior.`
			],
			subject => [
				`- ${subject} rebuilds cleanly and shows the target behavior through a run, assertion, or trace.`,
				`- The ${subject} checked cases include constructor setup, one method result, and a boundary or invalid input when relevant.`,
				`- Record the ${subject} Java rule or type boundary that prevents the code from becoming ambiguous.`
			],
			subject => [
				`- ${subject} has current evidence for the expected output or return value, not stale IDE state.`,
				`- ${subject} checks a standard case, a state-changing case, and one edge case where the prompt allows it.`,
				`- The ${subject} explanation identifies the field, method, class, interface, record, or collection that controls the behavior.`
			],
			subject => [
				`- ${subject} compiles from a clean start and the important method calls can be traced.`,
				`- The ${subject} verification covers ordinary behavior, boundary behavior, and one ownership or dispatch decision.`,
				`- The final ${subject} explanation connects the code result to a specific Java vocabulary term.`
			],
			subject => [
				`- ${subject} produces reproducible evidence for the required behavior through output, tests, or a trace table.`,
				`- The ${subject} checked cases include one standard scenario, one edge path, and one object or collection interaction.`,
				`- The closing ${subject} note states what responsibility each relevant class or method owns.`
			]
		]);
	}
	if (/c\+\+|cpp/.test(source)) {
		return variantLines(context, [
			subject => [
				`- ${subject} builds from the documented command or IDE target.`,
				`- ${subject} checks normal, boundary, and invalid or awkward inputs with visible output or tests.`,
				`- The ${subject} explanation names the relevant container, pointer/reference, ownership, or algorithm choice.`
			],
			subject => [
				`- ${subject} compiles from a clean run and records the command, target, or project configuration used.`,
				`- ${subject} verifies a typical case, a boundary case, and one invalid or edge case when the prompt allows it.`,
				`- Record the ${subject} type, container, memory, ownership, or algorithm decision that controlled correctness.`
			],
			subject => [
				`- ${subject} has current compile/run evidence rather than relying on stale IDE output.`,
				`- ${subject} checks the ordinary behavior and one case that could expose a pointer, reference, lifetime, or container mistake.`,
				`- The ${subject} explanation separates language syntax from the design or data-structure choice.`
			],
			subject => [
				`- ${subject} can be rebuilt and rerun with the same observable result from the documented setup.`,
				`- ${subject} includes at least one standard scenario, one edge case, and one case tied to ownership, mutation, or algorithm behavior.`,
				`- The final ${subject} note states why the selected abstraction or low-level mechanism fits the problem.`
			]
		]);
	}
	if (/security|offensive|low-level security|network security/.test(source)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} lab uses only approved local or owned targets.`,
				`- ${subject} findings are written as evidence plus impact, not as vague observations.`,
				`- The final ${subject} work includes a safe remediation, detection, or hardening step.`
			],
			subject => [
				`- ${subject} stays inside the stated authorization boundary and uses only approved local evidence.`,
				`- The ${subject} result connects each finding to a log, trace, request, response, packet, config, or command output.`,
				`- Record the ${subject} defensive control or rollback that reduces the risk.`
			],
			subject => [
				`- ${subject} verifies the target is a provided fixture, intentionally vulnerable lab, or owned system.`,
				`- ${subject} separates observed evidence from inferred impact so the conclusion can be reviewed safely.`,
				`- The closing ${subject} check proves mitigation, detection, hardening, or no-regression behavior.`
			],
			subject => [
				`- ${subject} documents the approved target, allowed traffic or inputs, and stop condition.`,
				`- ${subject} includes enough evidence to reproduce the defensive finding without expanding the scope.`,
				`- The final ${subject} result is framed as remediation, monitoring, safer configuration, or validated recovery.`
			]
		]);
	}

	return [
		"- The result can be reproduced from a clean start.",
		"- A typical case and one boundary or unusual case are checked.",
		"- The explanation names the main reasoning or design choice without restating every step line by line."
	];
}

function extensionSubject(context: CourseTextContext) {
	const itemSubject = scopedItemSubject(context);
	if (
		itemSubject &&
		(isProjectLikeItem(context.item) ||
			isAppliedStudioContext(context) ||
			isScienceContext(context))
	) {
		return itemSubject;
	}

	if (
		isCheckInContext(context) ||
		context.courseId === "java-without-graphics" ||
		context.courseId === "java-with-graphics"
	) {
		return withCourseContext(context.course.name, context.module.title);
	}

	return context.module.title;
}

function scopedItemSubject(context: CourseTextContext) {
	const itemTitle = compactWhitespace(context.item.title);
	const moduleTitle = compactWhitespace(context.module.title);
	if (!itemTitle || itemTitle === moduleTitle) return "";
	const compactModuleTitle = compactAppliedLabTitle(moduleTitle);
	const compactItemTitle = compactAppliedLabTitle(itemTitle);

	if (isAppliedStudioContext(context)) {
		if (genericSupportItemTitlePattern.test(itemTitle)) {
			const itemLabel =
				compactStudioContextTitle(itemTitle).toLowerCase();

			return itemLabel
				? `${compactModuleTitle} ${itemLabel}`
				: compactModuleTitle;
		}

		if (
			compactItemTitle
				.toLowerCase()
				.startsWith(`${compactModuleTitle.toLowerCase()}:`)
		) {
			const itemSuffix = compactItemTitle
				.slice(compactModuleTitle.length + 1)
				.trim();

			if (genericSupportItemTitlePattern.test(itemSuffix)) {
				return compactModuleTitle;
			}
			if (itemSuffix) {
				return `${compactModuleTitle} ${itemSuffix}`;
			}
		}

		if (
			compactItemTitle
				.toLowerCase()
				.startsWith(`${compactModuleTitle.toLowerCase()} supplemental `)
		) {
			return compactItemTitle;
		}

		if (compactItemTitle.includes(":")) {
			const itemSuffix = compactItemTitle.split(":").at(-1)?.trim() ?? "";
			if (genericSupportItemTitlePattern.test(itemSuffix)) {
				return compactItemTitle;
			}
		}
	}
	if (
		/:\s+\S/.test(itemTitle) &&
		projectLikeTitlePattern.test(itemTitle) &&
		!genericSupportItemTitlePattern.test(itemTitle)
	) {
		return compactItemTitle;
	}
	if (itemTitle.includes(moduleTitle) || moduleTitle.includes(itemTitle)) {
		return itemTitle;
	}

	return `${itemTitle} (${moduleTitle})`;
}

function stableVariantIndex(seed: string, count: number) {
	let hash = 2166136261;

	for (const character of seed) {
		hash ^= character.charCodeAt(0);
		hash = Math.imul(hash, 16777619) >>> 0;
	}

	return hash % count;
}

function variantPrompt(
	context: CourseTextContext,
	templates: Array<(subject: string) => string>
) {
	const seed = `${context.courseId}|${context.module.title}|${context.item.title}`;
	return templates[stableVariantIndex(seed, templates.length)](
		extensionSubject(context)
	);
}

function variantLines(
	context: CourseTextContext,
	templates: Array<(subject: string) => string[]>
) {
	const seed = `${context.courseId}|${context.module.title}|${context.item.title}`;
	return templates[stableVariantIndex(seed, templates.length)](
		extensionSubject(context)
	);
}

function extensionPrompt(context: CourseTextContext) {
	const source = contextText(context);

	if (/ap computer science|apcs/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with a short trace that changes one loop bound, branch condition, or method call.`,
			subject =>
				`Add an AP-style follow-up for ${subject} that asks how one changed precondition affects the result.`,
			subject =>
				`Create a compact scoring or reasoning note for ${subject} that targets one likely AP point loss.`,
			subject =>
				`Add one alternate input for ${subject} and explain which Java statement or method behavior controls the outcome.`
		]);
	}
	if (/python level 1|python level 2/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`Add input validation to ${subject} for one unexpected, blank, or awkward response.`,
			subject =>
				`Add one extra mode to ${subject} that reuses the same variables, loops, or helper functions.`,
			subject =>
				`Create a retry or recovery path in ${subject} so an awkward input does not stop the program.`,
			subject =>
				`Create one alternate output path for ${subject} and test it with a small hand-traced input.`,
			subject =>
				`Add one file, list, dictionary, loop, or helper-function variation to ${subject} while keeping the output traceable.`,
			subject =>
				`Change the accepted data pattern for ${subject} and record how the validation or parsing logic responds.`,
			subject =>
				`Add one edge case to ${subject} that exercises an empty value, duplicate value, casing issue, or punctuation issue.`,
			subject =>
				`Refactor one repeated step in ${subject} into a helper and test it with a compact example.`
		]);
	}
	if (isScratchSource(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with a new sprite interaction that reuses the same event or state logic.`,
			subject =>
				`Add a broadcast or backdrop change to ${subject} and explain what triggers it.`,
			subject =>
				`Add a difficulty option to ${subject} by changing a timer, score, speed, or clone rule.`,
			subject =>
				`Add one feedback cue to ${subject} so the player can tell what state changed.`
		]);
	}
	if (isPygameSource(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one actor or level state while keeping the game loop readable.`,
			subject =>
				`Add a collision, scoring, or failure rule to ${subject} and test the boundary case.`,
			subject =>
				`Add one input mode or difficulty curve to ${subject} without hiding the main state updates.`,
			subject =>
				`Instrument ${subject} with one debug display that exposes position, velocity, collision, or game-state data.`
		]);
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one small view, state transition, or navigation path.`,
			subject =>
				`Add a persistence or loading-state check to ${subject} and verify it in the simulator.`,
			subject =>
				`Add one accessibility improvement to ${subject}, such as a label, trait, contrast check, or Dynamic Type check.`,
			subject =>
				`Add a release-readiness check to ${subject} that records build, signing, asset, or preview evidence.`
		]);
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one diagnostic command and the expected output that confirms the system state.`,
			subject =>
				`Add a rollback or recovery step to ${subject} and document the condition that triggers it.`,
			subject =>
				`Add a logging, permission, service, or automation check to ${subject} that can be rerun from a clean shell.`,
			subject =>
				`Add one failure-mode check to ${subject} and record the command that distinguishes it from the healthy state.`
		]);
	}
	if (isNetworkSystemsContext(context, source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one diagnostic variation using a different host, port, route, or DNS answer.`,
			subject =>
				`Add a packet, service, or firewall comparison to ${subject} and explain the observed difference.`,
			subject =>
				`Add one blocked-path or failure-path test to ${subject} and identify the layer where it appears.`,
			subject =>
				`Add a topology or address change to ${subject} and predict the command output before running it.`
		]);
	}
	if (isWebContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Add one loading, empty, invalid, or error state to ${subject} and verify it in the browser.`,
			subject =>
				`Add one responsive layout or keyboard path to ${subject} and record the observable result.`,
			subject =>
				`Add one user-flow variation to ${subject} that changes input, state, API behavior, or persistence.`,
			subject =>
				`Add one console, network, or server-side verification step for the same ${subject} user action.`,
			subject =>
				`Add one accessibility check to ${subject}, such as focus order, label clarity, contrast, or reduced-motion behavior.`,
			subject =>
				`Add one refresh or navigation test to ${subject} so the state does not depend on hidden setup.`
		]);
	}
	if (isJavaContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one additional method and a test or console trace that proves its contract.`,
			subject =>
				`Add a subclass, interface, or record variation to ${subject} without changing the existing public behavior.`,
			subject =>
				`Add one collection, object-state, or method-overload case to ${subject} and document the expected output.`,
			subject =>
				`Add a small negative or edge-case test to ${subject} that protects the class boundary already built.`,
			subject =>
				`Add one constructor, accessor, mutator, or helper-method variation to ${subject} and explain the contract it preserves.`,
			subject =>
				`Add one record, interface, inheritance, or collection example to ${subject} and compare it with the base version.`,
			subject =>
				`Add one awkward input or object-state transition to ${subject} and document the expected method result.`,
			subject =>
				`Refactor one responsibility in ${subject} into a clearer class or method boundary without changing public behavior.`
		]);
	}
	if (/c\+\+|cpp|systems|assembly/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with a debug mode that exposes one internal state, pointer, register, or ownership decision.`,
			subject =>
				`Add a tiny benchmark or trace to ${subject} that makes the performance or memory tradeoff visible.`,
			subject =>
				`Add one invalid-input or lifetime-boundary test to ${subject} and record the diagnostic evidence.`,
			subject =>
				`Add a build, sanitizer, debugger, or logging check to ${subject} that confirms the low-level behavior.`,
			subject =>
				`Add one ownership, cleanup, or resource-limit variation to ${subject} and compare the observed output with the expected state.`,
			subject =>
				`Add a command-line option, input fixture, or diagnostic flag to ${subject} and record how the evidence changes.`,
			subject =>
				`Add one stress or boundary run to ${subject} that targets allocation, indexing, lifetime, timing, or process behavior.`,
			subject =>
				`Add a reproducibility note to ${subject} with the exact command, expected output, and one tool-backed observation.`
		]);
	}
	if (/science|physics|chemistry|biology|earth|ecosystem/.test(source)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} by applying the same model to a new example and naming what changes.`,
			subject =>
				`Add a changed-variable prediction to ${subject} and connect it to the model or data source.`,
			subject =>
				`Add a second phenomenon or dataset to ${subject} and compare the evidence that supports the claim.`,
			subject =>
				`Add one model limitation to ${subject} and explain what evidence would make the explanation stronger.`
		]);
	}

	return variantPrompt(context, [
		subject =>
			`Extend ${subject} with one changed constraint that still uses the same core idea.`,
		subject =>
			`Add one transfer case to ${subject} that changes the input, representation, or success condition.`,
		subject =>
			`Add one verification example to ${subject} that would catch a different mistake than the baseline case.`,
		subject =>
			`Add one small feature to ${subject} and explain which concept it reuses rather than only decorating the output.`
	]);
}

function normalizeSupportFocusPrefix(
	context: CourseTextContext,
	focus: string
) {
	const genericPrefixMatch = focus.match(
		/^(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Understanding Check|Extension Challenge|Fluency Drill|Focused Practice|Guided Example|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Project|Review and Reflection|Review|Standards Practice Set|Supplemental Project|Verification and Reflection|Verification Review|Worked Example|Checkpoint):\s*/i
	);
	if (!genericPrefixMatch) return focus;

	const moduleTopic =
		cleanSupportTopicTitle(context.module.title) ||
		cleanModuleTopicTitle(context.module.title);
	const replacementTopic =
		moduleTopic && !genericSupportItemTitlePattern.test(moduleTopic)
			? moduleTopic
			: projectSupportReference(context);

	return `${replacementTopic}: ${focus.slice(genericPrefixMatch[0].length)}`;
}

function projectSupport(context: CourseTextContext) {
	const focus = normalizeSupportFocusPrefix(
		context,
		projectSupportFocus(context)
	);
	const reference = projectSupportScopedReference(
		context,
		projectSupportReference(context)
	);
	const capitalizedReference = capitalizeSentence(reference);
	const goal = variantPrompt(context, [
		() =>
			`**Goal:** ${capitalizedReference} has an observable result, one standard path, and one boundary check.`,
		() =>
			`**Goal:** Make ${reference} easy to verify by stating expected behavior, observing actual behavior, and explaining one evidence point.`,
		() =>
			`**Goal:** Build a compact working version of ${reference}, then add one improvement or edge case.`,
		() =>
			`**Goal:** Show how ${reference} works through an observable result, trace, model, or interaction, then record what confirms it.`,
		() =>
			`**Goal:** Verify ${reference} with one standard case and one boundary case that exposes the key concept.`,
		() =>
			`**Goal:** Build a small working version of ${reference}, then add one visible improvement and evidence that it works.`,
		() =>
			`**Goal:** Apply the concept in ${reference}, then compare expected behavior with the observed result.`,
		() =>
			`**Goal:** ${capitalizedReference} uses clear structure, naming, and evidence so the final result is easy to inspect.`,
		() =>
			`**Goal:** Choose one design or reasoning decision in ${reference}, test it, and show its effect in the final artifact.`,
		() =>
			`**Goal:** Demonstrate ${reference} with one standard case and one boundary case that tests the central idea.`,
		() =>
			`**Goal:** Map the prompt requirements to ${reference}, then document the result that confirms the work.`,
		() =>
			`**Goal:** Identify the starting state, main transformation, and output or conclusion for ${reference}.`
	]).replace(/\*\*Goal:\*\* Build Build\b/g, "**Goal:** Build");

	return [
		goal,
		`**Focus:** ${capitalizeSentence(focus)}.`,
		`**Required outcome:**\n${compactGeneratedProjectSupport(context, projectExpectations(context)).join("\n")}`,
		`**Completion checks:**\n${compactGeneratedProjectSupport(context, completionChecks(context)).join("\n")}`,
		`**Extension:** ${compactGeneratedProjectSupport(context, [extensionPrompt(context)])[0]}`
	].join("\n\n");
}

function projectSupportFocus(context: CourseTextContext) {
	const source = contextText(context);

	if (isPygameSource(source)) {
		return "PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback";
	}

	if (isScratchSource(source)) {
		return scratchDesignFocus(context);
	}

	return subjectFocus(context);
}

function projectSupportReference(context: CourseTextContext) {
	const source = contextText(context);
	const title = context.item.title.toLowerCase();

	if (/practice exam|multiple choice|frq|free response/.test(title))
		return "the practice set";
	if (isCheckInContext(context)) return "the checkpoint";
	if (isCompetitiveProgrammingContext(context)) return "the solution";
	if (
		isScratchSource(source) ||
		isPygameSource(source) ||
		isUnityContext(context)
	) {
		return "the project";
	}
	if (isScienceContext(context)) return "the activity";
	if (isMathContext(context)) return "the response";
	if (isApcsContext(context)) {
		return variantPrompt(context, [
			() => "the AP Java task",
			() => "the AP-style exercise",
			() => "the Java checkpoint",
			() => "the traced solution",
			() => "the practice task"
		]);
	}
	if (isJavaContext(context)) {
		return variantPrompt(context, [
			() => "the Java exercise",
			() => "the class exercise",
			() => "the project",
			() => "the code checkpoint",
			() => "the object-design exercise",
			() => "the practice build",
			() => "the method-contract checkpoint",
			() => "the API checkpoint",
			() => "the object-state build",
			() => "the collection exercise",
			() => "the data-structure exercise",
			() => "the design checkpoint"
		]);
	}
	if (isWebContext(context)) return "the page";
	if (/security|offensive|low-level security|network security/.test(source))
		return "the lab";
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	)
		return "the system check";
	if (isLowLevelSystemsContext(context) || /c\+\+|cpp/.test(source)) {
		return variantPrompt(context, [
			() => "the program",
			() => "the command-line build",
			() => "the runtime check",
			() => "the diagnostic run",
			() => "the runtime trace",
			() => "the memory trace",
			() => "the tooling check"
		]);
	}
	if (isDataAiMlContext(context)) return "the analysis";
	if (/python/.test(source)) return "the program";

	return "the work";
}

function projectSupportScopedReference(
	context: CourseTextContext,
	reference: string
) {
	const topic = supportFocusTopic(context);
	if (!topic || topic === "this course item") return reference;

	const bareReference = reference.replace(/^the\s+/i, "");
	const normalizedTopic = topic.toLowerCase();
	const normalizedReference = bareReference.toLowerCase();
	if (
		normalizedTopic === normalizedReference ||
		normalizedTopic.endsWith(` ${normalizedReference}`) ||
		normalizedTopic.includes(`${normalizedReference}:`) ||
		(normalizedReference === "class exercise" && /\bclass$/i.test(topic))
	) {
		return reference;
	}
	if (
		/\b(?:project|program|activity|exercise|checkpoint|practice|lab|build|notebook|audit|reflection|challenge|drill|response|analysis|solution)\b/i.test(
			topic
		)
	) {
		return topic;
	}

	const [firstReferenceWord = "", ...remainingReferenceWords] =
		bareReference.split(/\s+/);
	const firstReferenceRoot = firstReferenceWord.split("-")[0];
	if (
		firstReferenceRoot &&
		new RegExp(
			`\\b${escapeStringForRegExp(firstReferenceRoot)}$`,
			"i"
		).test(topic)
	) {
		const trimmedFirstWord = firstReferenceWord
			.replace(
				new RegExp(
					`^${escapeStringForRegExp(firstReferenceRoot)}[-\\s]?`,
					"i"
				),
				""
			)
			.trim();
		const collapsedReference = [
			trimmedFirstWord,
			...remainingReferenceWords
		]
			.filter(Boolean)
			.join(" ");
		if (collapsedReference) return `the ${topic} ${collapsedReference}`;
	}

	return `the ${topic} ${bareReference}`
		.replace(/\bBuild Build\b/g, "Build")
		.replace(/\bclass class exercise\b/gi, "class exercise")
		.replace(
			/\b(the .+?) (diagnostic run|runtime check|runtime trace|memory trace|tooling check|command-line build) \2\b/gi,
			"$1 $2"
		);
}

function capitalizeSentence(value: string) {
	return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function markdownSafeGeneratedReference(value: string) {
	return value
		.replace(/\s+-\s+/g, ": ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function escapeStringForRegExp(value: string) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compactGeneratedProjectSupport(
	context: CourseTextContext,
	lines: string[]
) {
	const subject = extensionSubject(context);
	if (!subject) return lines;

	const escapedSubject = escapeStringForRegExp(subject);
	const reference = markdownSafeGeneratedReference(
		projectSupportScopedReference(context, projectSupportReference(context))
	);
	const capitalizedReference = capitalizeSentence(reference);
	const bareReference = reference.replace(/^the\s+/i, "");
	const escapedBareReference = escapeStringForRegExp(bareReference);
	const escapedReference = escapeStringForRegExp(reference);
	const escapedCourseName = escapeStringForRegExp(context.course.name);
	const compactableFinalNouns = isJavaContext(context)
		? "response|answer|work"
		: "note|response|answer|explanation|work";
	const compactableSubjectNouns = isJavaContext(context)
		? "solution|result|feature|page|lab|work|topology|vocabulary|reasoning|conclusion|response|answer|Java code"
		: "solution|result|feature|page|lab|work|topology|vocabulary|reasoning|conclusion|explanation|response|answer|Java code";
	const supportReferenceCleanupNames = [
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
		"Java exercise",
		"class model",
		"class exercise",
		"code checkpoint",
		"object-design task",
		"object-design exercise",
		"practice build",
		"type-model task",
		"method-contract exercise",
		"method-contract checkpoint",
		"API checkpoint",
		"object-state build",
		"collection exercise",
		"data-structure exercise",
		"Java design task",
		"design checkpoint",
		"systems artifact",
		"command-line build",
		"runtime check",
		"diagnostic run",
		"runtime trace",
		"memory trace",
		"tooling check",
		"low-level implementation",
		"system check",
		"lab",
		"solution",
		"page",
		"feature",
		"app path",
		"work"
	].join("|");
	const compactors: Array<[RegExp, string]> = [
		[
			new RegExp(
				`\\bThe final ${escapedSubject} (${compactableFinalNouns})\\b`,
				"g"
			),
			`The final ${bareReference} $1`
		],
		[
			new RegExp(
				`\\bThe ${escapedSubject} (${compactableSubjectNouns})\\b`,
				"g"
			),
			`The ${bareReference} $1`
		],
		[
			new RegExp(
				`\\bthe ${escapedSubject} (${compactableSubjectNouns})\\b`,
				"g"
			),
			`the ${bareReference} $1`
		],
		[
			new RegExp(
				`\\bone the (${supportReferenceCleanupNames}) (example|case|input|path|run|trace|observation)\\b`,
				"g"
			),
			"one $2 for the $1"
		],
		[
			new RegExp(`\\bAt least one ${escapedSubject} observation\\b`, "g"),
			"At least one observation"
		],
		[
			new RegExp(`\\bone ${escapedSubject} traceable case\\b`, "g"),
			"one traceable case"
		],
		[
			new RegExp(`\\ba tiny ${escapedSubject} traceable case\\b`, "g"),
			"a tiny traceable case"
		],
		[
			new RegExp(`\\ba short ${escapedSubject} (trace|note)\\b`, "g"),
			"a short $1"
		],
		[
			new RegExp(
				`\\b${indefiniteArticleFor(subject)} ${escapedSubject} note\\b`,
				"g"
			),
			"a short note"
		],
		[new RegExp(`\\bFor ${escapedSubject}, `, "g"), `For ${reference}, `],
		[new RegExp(`\\bIn ${escapedSubject}, `, "g"), `In ${reference}, `],
		[
			new RegExp(`\\bUse ${escapedSubject} to\\b`, "g"),
			`Use ${reference} to`
		],
		[new RegExp(`\\bTest ${escapedSubject}\\b`, "g"), `Test ${reference}`],
		[new RegExp(`\\bRun ${escapedSubject}\\b`, "g"), `Run ${reference}`],
		[
			new RegExp(`\\bBuild ${escapedSubject}\\b`, "g"),
			`Build ${reference}`
		],
		[
			new RegExp(`\\bComplete ${escapedSubject}\\b`, "g"),
			`Complete ${reference}`
		],
		[
			new RegExp(`\\bCompile and run ${escapedSubject}\\b`, "g"),
			`Compile and run ${reference}`
		],
		[
			new RegExp(`\\bbefore coding ${escapedSubject}\\b`, "g"),
			`before coding ${reference}`
		],
		[
			new RegExp(`\\bBefore coding ${escapedSubject}\\b`, "g"),
			`Before coding ${reference}`
		],
		[
			new RegExp(`\\b${escapedSubject} can\\b`, "g"),
			`${capitalizedReference} can`
		],
		[
			new RegExp(`\\b${escapedSubject} has\\b`, "g"),
			`${capitalizedReference} has`
		],
		[
			new RegExp(`\\b${escapedSubject} is\\b`, "g"),
			`${capitalizedReference} is`
		],
		[
			new RegExp(`\\b${escapedSubject} includes\\b`, "g"),
			`${capitalizedReference} includes`
		],
		[
			new RegExp(`\\b${escapedSubject} produces\\b`, "g"),
			`${capitalizedReference} produces`
		],
		[
			new RegExp(`\\b${escapedSubject} identifies\\b`, "g"),
			`${capitalizedReference} identifies`
		],
		[
			new RegExp(`\\b${escapedSubject} empty, loading\\b`, "g"),
			"Empty, loading"
		],
		[
			new RegExp(`\\b${escapedSubject} observations\\b`, "g"),
			"Observations"
		],
		[new RegExp(`\\b${escapedSubject} evidence\\b`, "g"), "Evidence"],
		[new RegExp(`\\b${escapedSubject} findings\\b`, "g"), "Findings"],
		[
			new RegExp(`\\b${escapedSubject} checks\\b`, "g"),
			`${capitalizedReference} checks`
		],
		[
			new RegExp(`\\b${escapedSubject} compiles\\b`, "g"),
			`${capitalizedReference} compiles`
		],
		[
			new RegExp(`\\b${escapedSubject} builds\\b`, "g"),
			`${capitalizedReference} builds`
		],
		[
			new RegExp(`\\b${escapedSubject} starts\\b`, "g"),
			`${capitalizedReference} starts`
		],
		[
			new RegExp(`\\b${escapedSubject} controls\\b`, "g"),
			`${capitalizedReference} controls`
		],
		[new RegExp(`\\b${escapedSubject} events\\b`, "g"), "Events"],
		[
			new RegExp(`\\b${escapedSubject} actor updates\\b`, "g"),
			"Actor updates"
		],
		[
			new RegExp(`\\b${escapedSubject} state changes\\b`, "g"),
			"State changes"
		]
	];

	return lines.map(line => {
		let compacted = line;
		for (const [pattern, replacement] of compactors) {
			compacted = compacted.replace(pattern, replacement);
		}

		compacted = compacted.replace(
			new RegExp(escapedSubject, "g"),
			reference
		);

		return compacted
			.replace(
				new RegExp(`(^|[.!?]\\s+)${escapedReference}\\b`, "g"),
				(_match, prefix: string) => `${prefix}${capitalizedReference}`
			)
			.replace(
				new RegExp(`\\bthe ${escapedReference}\\b`, "g"),
				reference
			)
			.replace(
				new RegExp(
					`\\bone the (${supportReferenceCleanupNames}) (example|case|input|path|run|trace|observation)\\b`,
					"g"
				),
				"one $2 for the $1"
			)
			.replace(
				new RegExp(
					`\\bone ${escapedReference} (example|case|input|path|run|trace|observation)\\b`,
					"g"
				),
				`one $1 for ${reference}`
			)
			.replace(
				new RegExp(`\\bthe visible ${escapedReference}\\b`, "g"),
				`the visible ${bareReference}`
			)
			.replace(
				new RegExp(`\\bthe visible ${escapedBareReference}\\b`, "g"),
				`the visible ${bareReference}`
			)
			.replace(
				new RegExp(`\\beach ${escapedReference} sprite\\b`, "g"),
				"each sprite"
			)
			.replace(
				new RegExp(`\\beach ${escapedBareReference} sprite\\b`, "g"),
				"each sprite"
			)
			.replace(
				new RegExp(`\\bwhich ${escapedReference} object\\b`, "g"),
				"which object"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedReference} block sequence\\b`,
					"g"
				),
				"which block sequence"
			)
			.replace(
				new RegExp(`\\bwhich ${escapedBareReference} object\\b`, "g"),
				"which object"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedBareReference} block sequence\\b`,
					"g"
				),
				"which block sequence"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedReference} (branch|loop|helper|collection|file step|comparison|comparisons|swap|swaps|operation|rule|path|step|values)\\b`,
					"g"
				),
				"which $1"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedBareReference} (branch|loop|helper|collection|file step|comparison|comparisons|swap|swaps|operation|rule|path|step|values)\\b`,
					"g"
				),
				"which $1"
			)
			.replace(
				new RegExp(
					`\\bTest ${escapedReference} (allocation|construction|mutation|copy|move|cleanup|state|file|permission|process|service|timer|network|log)\\b`,
					"g"
				),
				"Test $1"
			)
			.replace(
				new RegExp(
					`\\bTest ${escapedBareReference} (allocation|construction|mutation|copy|move|cleanup|state|file|permission|process|service|timer|network|log)\\b`,
					"g"
				),
				"Test $1"
			)
			.replace(
				new RegExp(
					`\\bState the ${escapedReference} (owner|known values|givens|data representation|input surface|input values|formula|topology)\\b`,
					"g"
				),
				"State the $1"
			)
			.replace(
				new RegExp(
					`\\bState the ${escapedBareReference} (owner|known values|givens|data representation|input surface|input values|formula|topology)\\b`,
					"g"
				),
				"State the $1"
			)
			.replace(
				new RegExp(
					`\\bSketch the ${escapedReference} (stack/heap|diagram|model)\\b`,
					"g"
				),
				"Sketch the $1"
			)
			.replace(
				new RegExp(
					`\\bSketch the ${escapedBareReference} (stack/heap|diagram|model)\\b`,
					"g"
				),
				"Sketch the $1"
			)
			.replace(
				new RegExp(
					`\\bRecord the ${escapedReference} (lifetime rule|normal case|reason|container|findings|evidence)\\b`,
					"g"
				),
				"Record the $1"
			)
			.replace(
				new RegExp(
					`\\bRecord the ${escapedBareReference} (lifetime rule|normal case|reason|container|findings|evidence)\\b`,
					"g"
				),
				"Record the $1"
			)
			.replace(
				new RegExp(
					`\\bthe ${escapedReference} (relationship|owner|known values|givens|data representation|input surface|input values|formula|topology|stack/heap|lifetime rule|normal case|reason|container|findings|evidence)\\b`,
					"g"
				),
				"the $1"
			)
			.replace(
				new RegExp(
					`\\bthe ${escapedBareReference} (relationship|owner|known values|givens|data representation|input surface|input values|formula|topology|stack/heap|lifetime rule|normal case|reason|container|findings|evidence)\\b`,
					"g"
				),
				"the $1"
			)
			.replace(
				new RegExp(`\\bMap ${escapedBareReference} to\\b`, "g"),
				"Map the work to"
			)
			.replace(
				new RegExp(`\\bTurn ${escapedBareReference} into\\b`, "g"),
				"Turn the work into"
			)
			.replace(
				/\bBuild the smallest reproducible the ([^.?!\n]+?) run first\b/g,
				"Build the smallest reproducible version of $1 first"
			)
			.replace(
				/\bBuild the core the ([^.?!\n]+?) run first\b/g,
				"Build the core $1 first"
			)
			.replace(
				/\bVerify the intended the ([^.?!\n]+?) behavior\b/g,
				"Verify the intended $1 behavior"
			)
			.replace(/\bOnce The ([^.?!\n]+?) has\b/g, "Once the $1 has")
			.replace(/\bFor For Loops\b/g, "For loops")
			.replace(
				/\bUse (?:the )?[A-Z][^.!?\n]{1,180}? checkpoint to ([a-z])/g,
				(_match: string, first: string) => capitalizeSentence(first)
			)
			.replace(
				/\bThe [A-Z][^.!?\n]{1,180}? checkpoint checked cases include\b/g,
				"The checked cases include"
			)
			.replace(
				/\bThe [A-Z][^.!?\n]{1,180}? checkpoint explanation\b/g,
				"The explanation"
			)
			.replace(
				/\bThe [A-Z][^.!?\n]{1,180}? checkpoint (has|checks|produces|compiles|builds|starts|controls|includes|identifies)\b/g,
				"The checkpoint $1"
			)
			.replace(
				/\b([Cc]losing note) for the [A-Z][^.!?\n]{1,180}? checkpoint\b/g,
				"$1"
			)
			.replace(
				/\b(to|for|in) the [A-Z][^.!?\n]{1,180}? checkpoint\b/g,
				"$1 the checkpoint"
			)
			.replace(/\bThe Evidence\b/g, "The evidence")
			.replace(
				new RegExp(`^- ${escapedReference} `),
				`- ${capitalizedReference} `
			)
			.replace(
				new RegExp(`^- the ${escapedBareReference} `, "g"),
				`- ${capitalizedReference} `
			)
			.replace(
				new RegExp(`^- The the ${escapedBareReference} `, "g"),
				`- ${capitalizedReference} `
			)
			.replace(
				new RegExp(`^- the (${supportReferenceCleanupNames})\\b`, "g"),
				(_match: string, item: string) => `- The ${item}`
			)
			.replace(
				new RegExp(`(^|[.!?]\\s+)${escapedReference}\\b`, "g"),
				(_match, prefix: string) => `${prefix}${capitalizedReference}`
			)
			.replace(
				new RegExp(
					`\\b(one|each|every|a|an) ${escapedReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path|insert\\/search\\/remove path|search|traceable case|sanity check|encode\\/decode round trip|limitation)\\b`,
					"g"
				),
				"$1 $2"
			)
			.replace(
				new RegExp(
					`\\b(one|each|every|a|an) ${escapedBareReference} (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path|insert\\/search\\/remove path|search|traceable case|sanity check|encode\\/decode round trip|limitation)\\b`,
					"g"
				),
				"$1 $2"
			)
			.replace(
				new RegExp(
					`\\bfinal the (${supportReferenceCleanupNames}) (note|explanation|response|answer|work|review)\\b`,
					"g"
				),
				"final $1 $2"
			)
			.replace(
				new RegExp(
					`\\bclosing the (${supportReferenceCleanupNames}) (note|explanation|response|answer|work|review|check)\\b`,
					"g"
				),
				"closing $1 $2"
			)
			.replace(
				new RegExp(
					`\\b(final|Final|closing|Closing) the ([^\\n]{1,220}?) ` +
						`(${supportReferenceCleanupNames}) ` +
						"(note|explanation|response|answer|work|review|check|result|conclusion)\\b",
					"g"
				),
				(
					_match: string,
					lead: string,
					topic: string,
					referenceName: string,
					noun: string
				) => `${lead} ${noun} for the ${topic} ${referenceName}`
			)
			.replace(
				new RegExp(
					`\\b(The|the) closing ${escapedReference} (note|explanation|response|answer|work|review|check)\\b`,
					"g"
				),
				(_match: string, article: string, noun: string) =>
					`${article} closing ${noun} for ${reference}`
			)
			.replace(
				new RegExp(
					`\\bone the (?:${supportReferenceCleanupNames}) (encode\\/decode round trip|search|limitation|normal case|edge case|traceable case|sanity check)\\b`,
					"g"
				),
				"one $1"
			)
			.replace(
				new RegExp(
					`\\b(one|each|every|a|an) the (?:${supportReferenceCleanupNames}) (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path)\\b`,
					"g"
				),
				"$1 $2"
			)
			.replace(
				/\b(one|each|every|a|an) the (?:[A-Z]{2}[A-Z0-9+.-]*|Unit|Module)\b[^.!?\n]{0,120}? (boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path|insert\/search\/remove path|search|traceable case|sanity check|limitation|example|case|input|path|run|trace|observation)\b/g,
				"$1 $2"
			)
			.replace(
				new RegExp(
					`\\b(one|each|every|a|an) the (?:${supportReferenceCleanupNames}) (insert\\/search\\/remove path|search)\\b`,
					"g"
				),
				"$1 $2"
			)
			.replace(/\b(one|each|every|a|an) the\b/gi, "$1")
			.replace(
				/\b(standard|typical|ordinary|small|minimal|runnable|visible|local|working|traceable|current|finished|final) the\b/gi,
				"$1"
			)
			.replace(
				/\b(the [A-Z][^.!?\n]{1,180}?) program build command\b/g,
				"$1 build command"
			)
			.replace(
				/\b(the [A-Z][^.!?\n]{1,180}?) program normal behavior\b/g,
				"$1 program's normal behavior"
			)
			.replace(
				new RegExp(
					`\\beach the (?:${supportReferenceCleanupNames}) Java type\\b`,
					"g"
				),
				"each Java type"
			)
			.replace(
				new RegExp(`\\beach ${escapedReference} Java type\\b`, "g"),
				"each Java type"
			)
			.replace(
				new RegExp(`\\beach ${escapedBareReference} Java type\\b`, "g"),
				"each Java type"
			)
			.replace(
				new RegExp(
					`\\bwhich the (${supportReferenceCleanupNames}) (comparisons|swaps|keys|priority values)\\b`,
					"g"
				),
				"which $1 $2"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedReference} (Swift|SwiftUI|Xcode|signing|simulator|trace|score|comparison|visualization|command|diagnostic|representation detail|assumption|recursive or iterative branch|statement|method|constructor|array access|list call|class relationship)\\b`,
					"g"
				),
				"which $1"
			)
			.replace(
				new RegExp(
					`\\bwhich ${escapedBareReference} (Swift|SwiftUI|Xcode|signing|simulator|trace|score|comparison|visualization|command|diagnostic|representation detail|assumption|recursive or iterative branch|statement|method|constructor|array access|list call|class relationship)\\b`,
					"g"
				),
				"which $1"
			)
			.replace(
				new RegExp(
					`\\b(a compact|one|every|a|an) the (${supportReferenceCleanupNames}) (sample|Java type|comparisons|swaps|keys|priority values)\\b`,
					"g"
				),
				"$1 $2 $3"
			)
			.replace(
				new RegExp(
					`\\blocal the (?:${supportReferenceCleanupNames}) version\\b`,
					"g"
				),
				"local version"
			)
			.replace(
				new RegExp(
					`\\bVerify The (?:${supportReferenceCleanupNames}) (ordinary behavior|normal behavior|samples|findings|runtime evidence|page behavior|simulator path)\\b`,
					"g"
				),
				"Verify $1"
			)
			.replace(
				new RegExp(`\\b(${supportReferenceCleanupNames}) \\1\\b`, "gi"),
				"$1"
			)
			.replace(
				new RegExp(
					`\\bExtend the [A-Z0-9][^.!?\\n]{1,180}? (${supportReferenceCleanupNames}) with one additional method\\b`,
					"g"
				),
				"Extend the $1 with one additional method"
			)
			.replace(
				new RegExp(
					`\\bAdd one transfer case to the [A-Z0-9][^.!?\\n]{1,180}? (${supportReferenceCleanupNames}) that changes\\b`,
					"g"
				),
				"Add one transfer case to the $1 that changes"
			)
			.replace(
				new RegExp(
					`\\bChange one rule or control in the [A-Z0-9][^.!?\\n]{1,180}? (${supportReferenceCleanupNames}) while preserving\\b`,
					"g"
				),
				"Change one rule or control in the $1 while preserving"
			)
			.replace(/\b([A-Z][A-Z-]{3,})\s+\1\b/gi, "$1")
			.replace(
				new RegExp(`\\b${escapedCourseName} the ([A-Z])`, "g"),
				"the $1"
			)
			.replace(/\bJava Level [1-3] (?:The\s+)?the ([A-Z])/g, "the $1")
			.replace(/\bThe the ([A-Z])/g, "The $1")
			.replace(/\bthe the ([A-Z])/g, "the $1")
			.replace(
				/\bUse (the [^.?!\n]{1,160}? checkpoint) as a readiness check for \1\b/gi,
				"Use $1 to check readiness"
			)
			.replace(
				/\ballowed the ([A-Z][^.!?\n]{1,180}? lab) target\b/g,
				"allowed target for the $1"
			)
			.replace(/\bresponse answer\b/gi, "response")
			.replace(/\bactivity work\b/gi, "activity")
			.replace(
				new RegExp(
					`\\beach the (?:${supportReferenceCleanupNames}) `,
					"g"
				),
				"each "
			)
			.replace(
				/(^|\n)- ([a-z])/g,
				(_match, prefix: string, first: string) =>
					`${prefix}- ${first.toUpperCase()}`
			)
			.replace(/^[a-z]/, first => first.toUpperCase());
	});
}

function lessonSupport(context: CourseTextContext) {
	const focus = unscopedSubjectFocus(context);
	const topic = supportFocusTopic(context);
	const javaConceptPath = () =>
		variantPrompt(context, [
			() =>
				`**Concept path:** For ${topic}, responsibilities are mapped first: which class owns the state, which method changes it, and which output or test proves the behavior.`,
			() =>
				`**Concept path:** For ${topic}, the work connects Java syntax to a concrete responsibility: constructor setup, method contract, object state, collection choice, or interface/record boundary.`,
			() =>
				`**Concept path:** For ${topic}, the model is separated from the driver code, then checked with one standard scenario and one edge case so the Java behavior is visible.`,
			() =>
				`**Concept path:** For ${topic}, the work traces the Java idea from data shape to public behavior: fields, parameters, return values, object interactions, and compile-run evidence.`,
			() =>
				`**Concept path:** For ${topic}, each language feature links to a design choice, then verifies that choice through a runnable example and a changed case.`,
			() =>
				`**Concept path:** For ${topic}, the object boundary is made explicit first, then the value or reference is followed through one method call and one variation.`,
			() =>
				`**Concept path:** For ${topic}, Java structure acts as evidence: names, access levels, constructors, records or interfaces, and tests all point back to the same behavior.`,
			() =>
				`**Concept path:** For ${topic}, a small runnable example comes first, then one responsibility or object interaction changes to test whether the design still holds.`
		]);
	const conceptPath = variantPrompt(context, [
		() =>
			`**Concept path:** Start ${focus} work with the vocabulary needed for one concrete example, then check the same reasoning with a nearby variation.`,
		() =>
			`**Concept path:** Use ${focus} to connect one traceable example, one changed condition, and one explanation of what stayed consistent.`,
		() =>
			`**Concept path:** Name the main representation in ${focus}, then trace it through a concrete task and a variation.`,
		() =>
			`**Concept path:** Use one worked example in ${focus} and one transfer check to show what changes when the situation changes.`,
		() =>
			`**Concept path:** Name the central idea in ${focus}, trace it through one example, and check it against a nearby case.`,
		() =>
			`**Concept path:** Make the rule or model in ${focus} visible first, then use a changed condition to test transfer.`,
		() =>
			`**Concept path:** Separate vocabulary, examples, changed cases, and evidence in ${focus} so each part can be checked clearly.`,
		() =>
			`**Concept path:** Anchor ${focus} with a focused example, then use a controlled variation to check whether the explanation still fits.`
	]);

	return [
		isJavaContext(context) ? javaConceptPath() : conceptPath,
		`**Failure modes:** ${failureModeGuidance(context)}`,
		`**Mastery check:** ${proficiencyEvidence(context)}`
	].join("\n\n");
}

function diagnosticSupport(context: CourseTextContext) {
	const compact = (line: string) =>
		compactGeneratedProjectSupport(context, [line])[0];
	const focus = unscopedSubjectFocus(context);
	const readiness = compact(
		variantPrompt(context, [
			subject =>
				`This is a formative check for ${subject} in ${focus}, not a pass/fail quiz. In ${subject}, the independent attempt comes first, then the result identifies whether the issue is ${diagnosticCategories(context)}.`,
			subject =>
				`${subject} checks readiness for ${focus}. The first pass is independent, then any gap is classified as ${diagnosticCategories(context)}.`,
			subject =>
				`${subject} checks whether the core idea is ready for transfer. The ${subject} independent attempt comes first; the evidence identifies whether the next step is ${diagnosticCategories(context)}.`,
			subject =>
				`${subject} is a low-stakes checkpoint: solve what is possible first, then identify the smallest missing piece before harder work.`,
			subject =>
				`${subject} locates the current bottleneck: ${diagnosticCategories(context)}, or explanation.`,
			subject =>
				`A short independent attempt for ${subject} comes first, followed by comparison with the core concept before support is added.`,
			subject =>
				`${subject} reveals whether the next step is more practice, a smaller example, concept review, or transfer work.`,
			subject =>
				`The easiest part of ${subject} comes first; the missing or uncertain step identifies the next review target.`
		])
	);

	return polishDiagnosticSupportText(
		[
			`**Readiness check:** ${readiness}`,
			`**Evidence of proficiency:** ${compact(proficiencyEvidence(context))}`,
			`**If this is difficult:** ${compact(remediationPrompt(context))}`,
			`**Extension:** ${compact(diagnosticExtensionPrompt(context))}`
		].join("\n\n")
	);
}

function scienceCourseBand(context: CourseTextContext) {
	if (context.courseId === "elementary-science") return "elementary science";
	if (context.courseId === "middle-school-integrated-science")
		return "middle-school science";
	if (context.courseId === "intro-to-chemistry") return "chemistry";
	if (context.courseId === "intro-to-physics") return "introductory physics";
	if (context.courseId === "physics-level-2") return "physics modeling";

	return "science";
}

function scienceTopicFocus(context: CourseTextContext) {
	const text = moduleItemText(context);

	if (/question|evidence|fair test|variable|scientist/.test(text))
		return "questions, variables, observations, and fair comparisons";
	if (/life|living|plant|animal|habitat|ecosystem|food chain/.test(text))
		return "living systems, needs, habitats, and relationships";
	if (
		/cell|microscope|body system|genetic|trait|adapt|inherit|dna|species|population/.test(
			text
		)
	) {
		return "cells, body systems, traits, inheritance, and adaptation";
	}
	if (/weather|water|earth|rock|climate|hazard/.test(text))
		return "Earth systems, weather patterns, water movement, and changing landforms";
	if (
		/force|motion|energy|wave|sound|light|electric|magnet|circuit/.test(
			text
		)
	) {
		return "forces, motion, energy transfer, waves, and field interactions";
	}
	if (/matter|solid|liquid|gas|particle|mixture|solution|density/.test(text))
		return "matter, particle models, mixtures, solutions, and observable properties";
	if (
		/\batom|periodic|bond|formula|molecule|reaction|stoich|molar|mole\b|\bph\b|\bacid\b|\bbase\b/.test(
			text
		)
	) {
		return "particles, formulas, reactions, conservation, and chemical evidence";
	}
	if (/model|diagram|graph|data|measurement/.test(text))
		return "models, measurements, graphs, data quality, and evidence limits";
	if (/capstone|portfolio|master|final/.test(text))
		return "evidence synthesis, model choice, limitations, and communication";

	return "observable phenomena, models, data, vocabulary, and claim-evidence-reasoning";
}

function scienceEvidenceFormat(context: CourseTextContext) {
	const text = moduleItemText(context);

	if (/simulation|phet|model/.test(text))
		return "simulation settings, screenshots, diagrams, and written observations";
	if (/data|graph|measurement|table/.test(text))
		return "provided data tables, graph features, measurements, and units";
	if (/video|image|picture|case|detective|scenario/.test(text))
		return "short media clips, images, scenario cards, and observation notes";
	if (/project|challenge|capstone|portfolio/.test(text))
		return "the provided source, a labeled model, a small data display, and a CER draft";

	return "images, short readings, diagrams, public datasets, simulations, or structured notes";
}

function scienceSupport(context: CourseTextContext) {
	const compact = (line: string) =>
		compactGeneratedProjectSupport(context, [line])[0];
	const band = scienceCourseBand(context);
	const topic = scienceTopicFocus(context);
	const evidenceFormat = scienceEvidenceFormat(context);
	const materialBoundary = band.includes("physics")
		? "special lab supplies, physical sensors, or dedicated equipment are not required"
		: band.includes("elementary") || band.includes("middle-school")
			? "specialized science equipment or household experiments are not required"
			: "beakers, kits, and household materials are not required";
	const remoteInvestigation = variantPrompt(context, [
		subject =>
			`${subject} uses shared-screen materials and paper notes alongside ${evidenceFormat}; for ${topic}, any physical demonstration is replaceable with evidence from the named resource, so ${materialBoundary}.`,
		subject =>
			`${subject} is designed for an online-session-safe ${band} workflow using ${evidenceFormat}. This ${band} evidence plan for ${topic} treats physical supplies as optional only when the same question can be answered from notes, diagrams, tables, or screen-shared resources.`,
		subject =>
			`${subject} can be completed with a notebook, pencil, and shared digital resources focused on ${topic}. If the ${band} example about ${topic} uses a physical demonstration, the required investigation still comes from data, diagrams, models, or simulations.`,
		subject =>
			`${subject} relies on accessible digital evidence: ${evidenceFormat}. For ${subject}, any optional observation stays simple and must be replaceable by the same evidence source named in the activity.`
	]);
	const output = variantPrompt(context, [
		subject =>
			`Complete a claim-evidence-reasoning response for ${subject}, plus a labeled diagram or data table tied to ${topic}. Add one prediction about a changed condition.`,
		subject =>
			`Finish ${subject} with a labeled model or table, a short CER response, and one comparison between observation and inference for ${topic}.`,
		subject =>
			`Document evidence from ${subject}, annotate the model or data display, and write one claim about ${topic} that the evidence can support.`,
		subject =>
			`For ${subject}, produce a concise explanation that includes target vocabulary, evidence from ${evidenceFormat}, and one limit or next-test idea.`
	]);
	const scienceExplanation = variantPrompt(context, [
		subject =>
			`Anchor ${subject} in ${topic}. In ${subject}, begin with the evidence record, add the model annotation, and finish by explaining what the model accounts for and what it leaves out.`,
		subject =>
			`Use ${subject} to connect the phenomenon, evidence source, model, and vocabulary for ${topic} before writing the final claim.`,
		subject =>
			`For ${subject}, separate what is directly observed from what the model explains, then use the evidence to support a claim about ${topic}.`,
		subject =>
			`Ground ${subject} in ${evidenceFormat}, then make the model limitation visible when the explanation is written.`
	]);

	return [
		`**Investigation:** ${compact(remoteInvestigation)}`,
		`**Science explanation:** ${compact(scienceExplanation)}`,
		`**Output:** ${compact(output)}`,
		`**Completion checks:**\n${compactGeneratedProjectSupport(
			context,
			completionChecks(context)
		).join("\n")}`
	].join("\n\n");
}

function scienceEvidenceCheckpoint(context: CourseTextContext) {
	return compactGeneratedProjectSupport(context, [
		variantPrompt(context, [
			subject =>
				`**CER checkpoint:** End ${subject} with a claim, evidence, and reasoning response. The activity claim answers the question, the evidence comes from the provided image, graph, dataset, reading, or simulation, and the reasoning uses the target vocabulary to explain why that evidence supports the claim.`,
			subject =>
				`**CER checkpoint:** For ${subject}, write one claim, cite the specific evidence source, and explain the connection with the target vocabulary rather than only naming the topic.`,
			subject =>
				`**CER checkpoint:** Finish ${subject} by separating the claim, the evidence, and the reasoning. The ${subject} evidence points to the resource used, and the reasoning explains why it supports the claim.`,
			subject =>
				`**CER checkpoint:** Connect ${subject} to a clear claim, a resource-based evidence statement, and reasoning that names the scientific idea or model being used.`,
			subject =>
				`**CER checkpoint:** Use ${subject} to name the phenomenon, quote or describe the evidence source, and explain the scientific model that links the evidence to the claim.`,
			subject =>
				`**CER checkpoint:** A complete response for ${subject} states the claim, identifies the observation or data behind it, and uses vocabulary from the module to justify the reasoning.`,
			subject =>
				`**CER checkpoint:** For ${subject}, write the claim first, then add one specific observation, measurement, graph feature, or simulation result as evidence.`,
			subject =>
				`**CER checkpoint:** Explain ${subject} with a claim, one cited piece of evidence, and a reasoning sentence that connects the evidence to the model.`,
			subject =>
				`**CER checkpoint:** Use ${subject} to separate what was observed from what was inferred, then connect both to the target science vocabulary.`,
			subject =>
				`**CER checkpoint:** Finish ${subject} by naming the evidence source, the claim it supports, and one limitation or alternate explanation.`
		])
	])[0];
}

function studioArtifact(context: CourseTextContext) {
	const source = contextText(context);

	if (isScratchSource(source)) {
		return "a playable Scratch project with clear event flow, sprite state, and feedback";
	}
	if (isPygameSource(source)) {
		return "a playable PyGame checkpoint with clear loop state, actors, events, collisions, and feedback";
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return "a Swift app checkpoint with visible UI behavior, state flow, build evidence, and release-readiness notes";
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return "a repeatable Linux systems checkpoint with commands, evidence, logs, and troubleshooting notes";
	}
	if (isNetworkSystemsContext(context, source)) {
		return "a network-systems checkpoint with topology, commands, packet or service evidence, and interpretation";
	}
	if (/assembly/.test(source)) {
		return "an annotated assembly trace or small program that proves register, stack, and memory behavior";
	}
	if (/c systems|systems build/.test(source)) {
		return "a constrained command-line systems component with explicit memory, file, or process behavior";
	}
	if (/algorithm|data structures|cpp/.test(source)) {
		return "a tested data-structure or algorithm implementation with visible before/after behavior";
	}
	if (/data science|machine learning|ai/.test(source)) {
		return "a notebook or script that turns a defined dataset or state space into measured, interpreted output";
	}
	if (
		/design pattern|pattern lab|refactor|pythonic design|solid|adapter|decorator|strategy|observer/.test(
			source
		)
	) {
		return "a behavior-preserving refactor or design-pattern implementation with tests, before/after structure, and tradeoff notes";
	}
	if (
		/unity|game development|scene setup|player feedback|playtesting/.test(
			source
		)
	) {
		return "a playable game checkpoint with scene behavior, state changes, player feedback, and playtest evidence";
	}
	if (/physics|chemistry|science/.test(source)) {
		return "an equipment-free investigation writeup using provided data, a diagram, or a simulation";
	}
	if (/security|offensive|network/.test(source)) {
		return "a safe local security lab report with threat model, evidence, and mitigation";
	}
	if (/web|full-stack/.test(source)) {
		return "a browser-visible feature with defined UI behavior, data flow, and error handling";
	}

	return "a clear result with defined behavior, test cases, and a short explanation";
}

function compactStudioContextTitle(title: string) {
	const stripped = stripLessonTitlePrefix(title).trim();
	const colonIndex = stripped.indexOf(":");
	const labPrefix =
		colonIndex > 0 ? stripped.slice(0, colonIndex).trim() : "";
	const labMatch = labPrefix.match(/^([A-Z0-9+ -]+ Lab) (\d+)$/i);

	if (labMatch) {
		const [, labName, labNumber] = labMatch;
		const labDetail = stripped.slice(colonIndex + 1).trim();

		if (/^(?:Applied|Implementation) (?:Lab|Studio)$/i.test(labDetail)) {
			return `${labName} ${labNumber}`;
		}

		return `${labName} ${labNumber} ${labDetail}`;
	}

	return stripped
		.replace(/^[A-Z]{2,6}\d+\s+/, "")
		.replace(
			/^(?:(?:Applied|Implementation) Studio|(?:Applied|Implementation) Lab):\s*/i,
			""
		)
		.replace(
			/:\s*(?:(?:Applied|Implementation) Studio|(?:Applied|Implementation) Lab)$/i,
			""
		)
		.replace(
			/\s+(?:(?:Applied|Implementation) Studio|(?:Applied|Implementation) Lab)$/i,
			""
		)
		.trim();
}

function articleSafeStudioReference(reference: string) {
	return reference.replace(/^(?:the|a|an)\s+/i, "");
}

function studioContextLabel(context: CourseTextContext) {
	const scopedSubject = scopedItemSubject(context);
	if (scopedSubject) {
		return compactStudioContextTitle(scopedSubject);
	}

	const itemTitle = stripLessonTitlePrefix(context.item.title);
	const moduleTitle = stripLessonTitlePrefix(context.module.title);

	if (genericSupportItemTitlePattern.test(itemTitle)) {
		const moduleLabel = compactStudioContextTitle(moduleTitle);
		const itemLabel = compactStudioContextTitle(itemTitle).toLowerCase();

		return `${moduleLabel} ${itemLabel}`;
	}

	return compactStudioContextTitle(itemTitle);
}

function studioSupportSubject(context: CourseTextContext, supportNoun: string) {
	const moduleLabel = compactStudioContextTitle(
		stripLessonTitlePrefix(context.module.title)
	);

	if (!moduleLabel) {
		return supportNoun === "lab" ? "This lab" : "This studio";
	}

	if (new RegExp(`\\b${supportNoun}\\b`, "i").test(moduleLabel)) {
		return moduleLabel;
	}

	return `This ${supportNoun} for ${moduleLabel}`;
}

function studioBuildSequence(context: CourseTextContext) {
	const source = contextText(context);
	const studioLabel = studioContextLabel(context);

	if (isScratchSource(source)) {
		return variantLines(context, [
			() => [
				`- For ${studioLabel}, define the sprites, controls, variables, broadcasts, costumes, or backdrops that control the main behavior.`,
				`- Test ${studioLabel} from the green-flag start through one normal play path, one reset path, and one score, collision, timing, or input boundary.`,
				`- Keep ${studioLabel} event flow traceable from player action to block sequence to visible stage feedback.`
			],
			() => [
				`- Name the ${studioLabel} starting stage state, player input, sprite response, scoring or timing rule, and reset behavior.`,
				`- Run ${studioLabel} from the green flag through a normal play path and one repeated-input or missed-input case.`,
				`- Trace the ${studioLabel} stage result back to the event blocks, broadcasts, variables, or costume changes that caused it.`
			],
			() => [
				`- Identify each ${studioLabel} sprite's job, the event that starts it, and the variable or broadcast that connects it to the game.`,
				`- Check ${studioLabel} startup, the main interaction, a boundary case, and a restart or cleanup path before adding polish.`,
				`- Use ${studioLabel} stage behavior to verify script order rather than relying only on reading the block stack.`
			]
		]);
	}
	if (isPygameSource(source)) {
		return variantLines(context, [
			() => [
				"- Define the game state, actor responsibilities, input events, collision rules, timing, and frame-by-frame update loop.",
				"- Test startup, player controls, collision/no-collision behavior, scoring or health changes, and reset or end-state behavior.",
				"- Keep drawing, updating, event handling, and game-state changes separated enough to debug one layer at a time."
			],
			() => [
				"- Name the loop state, event inputs, actor updates, collision checks, draw order, and finish condition.",
				"- Verify one clean start, one normal play interaction, one collision or no-collision case, and one reset path.",
				"- Keep a small debug output or visual cue available until the state transitions are easy to explain."
			],
			() => [
				"- Separate event handling, state updates, collision decisions, rendering, and scoring before adding complexity.",
				"- Test the first frame, repeated controls, a boundary interaction, and the win, loss, pause, or restart state.",
				"- Use a visible trace, log, or temporary overlay to confirm which state variable changed."
			]
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantLines(context, [
			() => [
				"- Define the screen, state owner, user action, data flow, and expected simulator behavior.",
				"- Build one view, model, state transition, navigation path, or persistence path at a time.",
				"- Verify a normal interaction, one empty or invalid state, and one layout, accessibility, or navigation check."
			],
			() => [
				"- Name the view responsibility, model data, user event, state mutation, and visible simulator result.",
				"- Add the smallest view or state change first, then test navigation, persistence, loading, or error behavior.",
				"- Check at least one layout, accessibility, preview, or device-size condition before treating the task as done."
			],
			() => [
				"- Sketch the UI state, action path, data boundary, and feedback shown after the action completes.",
				"- Implement the view/model/persistence path in small simulator-tested steps.",
				"- Verify the standard scenario plus one empty, invalid, inaccessible, or edge screen state."
			]
		]);
	}
	if (isSecurityContext(context)) {
		return variantLines(context, [
			() => [
				`- For ${studioLabel}, state the authorized local lab boundary, protected asset, unsafe assumption, and evidence needed.`,
				`- Capture ${studioLabel} logs, traces, requests, responses, configuration, or sanitizer output before and after the change.`,
				`- Verify ${studioLabel} normal behavior, failure or attack-shaped behavior, and one remediation, detection, or hardening result.`
			],
			() => [
				`- Name the ${studioLabel} allowed target, disallowed actions, evidence source, stop condition, and defensive purpose.`,
				`- Record the ${studioLabel} baseline behavior, controlled test, observed result, and smallest useful fix.`,
				`- Retest the ${studioLabel} scenario after mitigation and note what evidence proves the risk was reduced.`
			],
			() => [
				`- Define ${studioLabel} scope, authorization, reset path, expected signal, and what would count as unsafe escalation.`,
				`- Collect ${studioLabel} before/after evidence from the same local fixture, command, request, or configuration.`,
				`- Connect the ${studioLabel} observation to mitigation, hardening, monitoring, or a clear reason no action is needed.`
			]
		]);
	}
	if (isSystemsContext(context)) {
		return variantLines(context, [
			() => [
				`- Record the ${studioLabel} starting environment, command path, resource boundary, and expected observable result.`,
				`- Work through ${studioLabel} in short build, run, debug, or shell cycles so failures point to a specific boundary or assumption.`,
				`- Verify ${studioLabel} with a standard path, a failure or edge path, and one log, trace, sanitizer, memory, process, register, or timing detail.`
			],
			() => [
				`- Name the ${studioLabel} file, process, command, memory, register, service, or permission boundary being inspected.`,
				`- Change one ${studioLabel} variable at a time and keep the reproduce, observe, fix, and retest commands visible.`,
				`- Capture one ${studioLabel} successful output and one diagnostic output that explains a boundary or failure condition.`
			],
			() => [
				`- Describe the ${studioLabel} initial state, expected state transition, observable output, and cleanup or rollback path.`,
				`- Use short command/build/debug cycles for ${studioLabel} so the first failing step has a narrow cause.`,
				`- Verify both ${studioLabel} intended behavior and one edge case with concrete terminal, trace, log, or debugger evidence.`
			]
		]);
	}
	if (isWebContext(context)) {
		return variantLines(context, [
			() => [
				`- Identify the ${studioLabel} user interaction, state change, DOM/canvas/API output, and visible loading, empty, or error state.`,
				`- Implement one ${studioLabel} visible behavior at a time and inspect the page, console, network panel, or local server after each change.`,
				`- Verify ${studioLabel} with a normal interaction, an invalid or empty input, and one accessibility, layout, or deployment-readiness check.`
			],
			() => [
				`- Name the ${studioLabel} route or component, user action, state update, data/API boundary, and visible feedback.`,
				"- Build the smallest browser-visible path first, then add validation, loading, empty, or failure behavior.",
				`- Check the ${studioLabel} result in the rendered page plus one console, network, responsive, or accessibility condition.`
			],
			() => [
				`- Map the ${studioLabel} UI event to state, rendering, data flow, and the message shown when something goes wrong.`,
				`- Test ${studioLabel} with one standard scenario, one invalid input or empty state, and one narrow/wide layout or keyboard path.`,
				`- Keep the ${studioLabel} browser, console, and request/response evidence aligned with the stated requirement.`
			]
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			() => [
				`- Define the ${studioLabel} question, input data or state space, baseline, metric, and expected evidence before building.`,
				`- Expose ${studioLabel} intermediate results so the transformation, search, model, or visualization can be inspected.`,
				`- Verify ${studioLabel} with a small hand-checkable case, a representative case, and one limitation that affects interpretation.`
			],
			() => [
				`- Name the ${studioLabel} dataset or search space, target question, feature or column choices, and comparison point.`,
				`- Show at least one intermediate table, statistic, state, plot, or trace for ${studioLabel} before presenting the final result.`,
				`- Check ${studioLabel} with a toy example, a realistic example, and a caveat about sampling, labels, leakage, or assumptions.`
			],
			() => [
				`- State the ${studioLabel} hypothesis, evidence source, baseline, metric, and what result would count as meaningful.`,
				`- Make ${studioLabel} cleaning, transformation, search, modeling, or visualization steps inspectable before summarizing.`,
				`- Include one ${studioLabel} sanity check and one limitation so the conclusion does not overclaim.`
			]
		]);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		return variantLines(context, [
			() => [
				`- Assign each ${studioLabel} responsibility to a Java type, method contract, record, interface, or collection boundary.`,
				`- Compile ${studioLabel} after each meaningful constructor, method, branch, loop, field, or test change.`,
				`- Verify ${studioLabel} with a standard scenario, a boundary case, and one object-state or method-dispatch case tied to the concept.`
			],
			() => [
				`- Name the ${studioLabel} class or record data, public behavior, method inputs, return values, and expected output.`,
				`- Add ${studioLabel} fields, constructors, methods, loops, branches, and tests in compile-checked increments.`,
				`- Trace one ${studioLabel} ordinary object state, one boundary input, and one polymorphism, interface, or collection case.`
			],
			() => [
				`- Separate ${studioLabel} model responsibilities from console, file, UI, or runner code before adding extra features.`,
				`- Recompile after each ${studioLabel} contract change and keep the smallest runnable example available.`,
				`- Check ${studioLabel} constructor state, method behavior, invalid or edge input, and one Java-specific design choice.`
			],
			() => [
				`- Identify the ${studioLabel} data model, public API, helper logic, and runner responsibility before coding.`,
				`- Add one ${studioLabel} class, method, branch, or collection operation at a time with a compile/run check after each step.`,
				`- Test ${studioLabel} with an ordinary object, a boundary input, and one case involving reference behavior, inheritance, records, or interfaces.`
			],
			() => [
				`- State the ${studioLabel} class invariant, constructor expectations, method contract, and observable output.`,
				`- Keep a small ${studioLabel} driver or test harness available while fields, methods, and relationships change.`,
				`- Confirm ${studioLabel} normal behavior, one invalid or edge condition, and one Java design choice that affects the result.`
			],
			() => [
				`- Map ${studioLabel} requirements to fields, constructors, methods, collection operations, and any inheritance or interface boundary.`,
				`- Compile and run ${studioLabel} after each contract-level edit so errors stay tied to the most recent change.`,
				`- Review ${studioLabel} with a sample case, a changed input, and one explanation of state, dispatch, equality, or mutability.`
			]
		]);
	}
	if (isCppContext(context)) {
		return variantLines(context, [
			() => [
				`- Name the ${studioLabel} build command, data representation, ownership or lifetime boundary, and expected runtime behavior.`,
				`- Change one ${studioLabel} boundary at a time and keep the compile/run/debug command easy to repeat.`,
				`- Verify ${studioLabel} ordinary behavior, a boundary or invalid case, and one diagnostic trace tied to the C++ concept.`
			],
			() => [
				`- Identify the ${studioLabel} compile command, object lifetime, container or pointer boundary, and output to inspect.`,
				`- Keep each ${studioLabel} edit small enough that a compiler, sanitizer, debugger, or log points to the changed assumption.`,
				`- Check ${studioLabel} with a normal input, an invalid or edge input, and one memory, ownership, or performance observation.`
			],
			() => [
				`- State the ${studioLabel} representation, invariants, resource ownership, and command needed to reproduce the run.`,
				`- Build and test ${studioLabel} after each API, allocation, loop, branch, or data-structure change.`,
				`- Record one ${studioLabel} successful trace and one diagnostic trace tied to lifetime, bounds, copying, or complexity.`
			]
		]);
	}

	return variantLines(context, [
		() => [
			`- Name the ${studioLabel} artifact, input surface, output surface, state change, and success condition before building.`,
			`- Build ${studioLabel} in small observable steps, checking the result after each meaningful change.`,
			`- Verify ${studioLabel} with a standard path, a boundary or failure path, and one case tied directly to the main idea.`
		],
		() => [
			`- Define the ${studioLabel} starting state, action, expected result, evidence source, and failure or edge condition.`,
			`- Complete the smallest inspectable ${studioLabel} version first, then add one requirement at a time.`,
			`- Check the ${studioLabel} main case, one changed condition, and one explanation that links the result to the concept.`
		],
		() => [
			`- Separate ${studioLabel} setup, core behavior, verification evidence, and the final explanation before expanding scope.`,
			`- Keep every ${studioLabel} build step observable through output, trace, notes, screenshots, tests, or another concrete signal.`,
			`- Verify the ${studioLabel} expected result plus one condition that would expose a misunderstanding.`
		]
	]);
}

function studioCompletionChecks(context: CourseTextContext) {
	const source = contextText(context);
	const studioLabel = studioContextLabel(context);
	const fallbackLabel =
		studioLabel || context.course.name.trim() || context.courseId;

	if (isScratchSource(source)) {
		return variantLines(context, [
			() => [
				`- ${studioLabel} starts from a predictable green-flag state.`,
				`- ${studioLabel} controls, events, broadcasts, variables, sprite interactions, and reset behavior are checked where they apply.`,
				`- Record the ${studioLabel} state variable or event chain most responsible for correctness.`
			],
			() => [
				`- ${studioLabel} starting position, visible state, score or timer, and reset behavior are predictable.`,
				`- ${studioLabel} tests at least one normal play path and one awkward input or boundary case.`,
				`- The ${studioLabel} explanation connects a player action to the blocks that change the stage.`
			],
			() => [
				`- ${studioLabel} sprites, variables, broadcasts, costumes, sounds, or clones are checked where the project uses them.`,
				`- ${studioLabel} can be replayed without stale state from the previous run.`,
				`- The ${studioLabel} review note identifies the event chain that controls the most important behavior.`
			]
		]);
	}
	if (isPygameSource(source)) {
		return variantLines(context, [
			() => [
				"- The game starts from a predictable state and can be restarted or ended intentionally.",
				"- Actor updates, input events, collisions, score/health changes, and draw order are verified.",
				"- Record the game loop, the most important state variable, and one bug or edge case found during playtesting."
			],
			() => [
				"- The first frame, input response, collision path, score or health update, and end state are tested.",
				"- Draw order and state updates remain understandable when the game is replayed.",
				"- The review identifies one state variable or loop branch that caused a visible behavior."
			],
			() => [
				"- Normal play, missed input, collision or no-collision, and reset behavior all have defined results.",
				"- Temporary debug output or a visible indicator confirms the important state transition.",
				"- The final explanation separates event handling, updating, collision logic, and rendering."
			]
		]);
	}
	if (isSecurityContext(context)) {
		return variantLines(context, [
			() => [
				`- ${studioLabel} scope, authorization, allowed tools, and stop conditions are explicit.`,
				`- ${studioLabel} evidence is interpreted rather than pasted without explanation.`,
				`- The ${studioLabel} final state includes mitigation, hardening, rollback, or verification evidence.`
			],
			() => [
				`- The ${studioLabel} allowed local target, disallowed actions, reset path, and defensive goal are named.`,
				`- ${studioLabel} before/after evidence shows what changed and why the change matters.`,
				`- The ${studioLabel} conclusion distinguishes observation, risk, remediation, and remaining limitation.`
			],
			() => [
				`- ${studioLabel} stays inside the stated authorization boundary and uses only approved local evidence.`,
				`- The ${studioLabel} result explains impact rather than only listing tool output.`,
				`- ${studioLabel} retest evidence, monitoring, hardening, or rollback notes close the loop.`
			]
		]);
	}
	if (isSystemsContext(context)) {
		return variantLines(context, [
			() => [
				`- The ${studioLabel} command, environment, file, process, memory, register, or service boundary is named.`,
				`- ${studioLabel} normal behavior and one failure or edge path are verified with concrete output.`,
				`- The ${studioLabel} final note is reproducible from a clean shell or checkout.`
			],
			() => [
				`- ${studioLabel} setup, run, observe, cleanup, and retest commands are specific enough to repeat.`,
				`- At least one ${studioLabel} healthy output and one diagnostic output are captured.`,
				`- The ${studioLabel} explanation names the boundary or assumption that controlled the result.`
			],
			() => [
				`- ${studioLabel} environment assumptions, resource boundaries, expected output, and failure behavior are visible.`,
				`- ${studioLabel} terminal, trace, debugger, sanitizer, or log evidence supports the result.`,
				`- The ${studioLabel} final state includes a reproducible command path and any required cleanup.`
			]
		]);
	}
	if (isWebContext(context)) {
		return variantLines(context, [
			() => [
				`- The ${studioLabel} visible user flow, state transition, and data/API behavior work in the browser.`,
				`- ${studioLabel} loading, empty, invalid, or error behavior is checked where relevant.`,
				`- A ${studioLabel} narrow and wide layout or accessibility check is included.`
			],
			() => [
				`- The ${studioLabel} page shows the expected result for a normal action and an invalid, empty, or failed action.`,
				`- ${studioLabel} state, rendering, and request or persistence behavior agree with the requirement.`,
				`- ${studioLabel} browser evidence includes at least one responsive, keyboard, console, network, or accessibility check.`
			],
			() => [
				`- ${studioLabel} user input, state update, rendered output, and error messaging are all inspectable.`,
				`- The ${studioLabel} implementation handles at least one loading, empty, validation, or server-response edge case.`,
				`- The ${studioLabel} review includes a layout or accessibility note, not only a happy-path screenshot.`
			]
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			() => [
				`- The ${studioLabel} question, dataset or state-space assumptions, and metric or evidence source are explicit.`,
				`- ${studioLabel} includes a baseline, sanity check, or small hand-checkable example that supports the result.`,
				`- The ${studioLabel} final interpretation includes at least one limitation.`
			],
			() => [
				`- The ${studioLabel} source data or state space, target question, comparison point, and metric are named.`,
				`- An intermediate table, statistic, trace, or visualization for ${studioLabel} is checked before the conclusion.`,
				`- The ${studioLabel} writeup names one caveat about sampling, labels, assumptions, leakage, or measurement.`
			],
			() => [
				`- The ${studioLabel} result is compared with a baseline, toy case, or expectation that can be inspected.`,
				`- ${studioLabel} transformations, model/search behavior, or visual encodings are not hidden behind the final answer.`,
				`- The ${studioLabel} conclusion separates measured evidence from interpretation and future work.`
			]
		]);
	}

	return variantLines(context, [
		() => [
			`- ${studioLabel} shows the core idea through output, tests, traces, logs, a diagram, or another inspectable result.`,
			`- ${studioLabel} includes a named boundary, failure path, or changed-condition check beyond the provided sample.`,
			`- Record one ${studioLabel} implementation, debugging, or reasoning choice that changed the final result.`
		],
		() => [
			`- ${studioLabel} leaves behind a visible run, checked output, trace, table, screenshot, or written evidence source.`,
			`- ${studioLabel} checks a standard case and a changed, edge, or failure-mode case.`,
			`- The ${studioLabel} explanation names one decision that affected correctness, clarity, robustness, or interpretation.`
		],
		() => [
			`- ${studioLabel} defines the requirement, success signal, and evidence source clearly enough to review later.`,
			`- ${studioLabel} includes at least one verification case beyond the provided sample.`,
			`- The ${fallbackLabel} final note explains the confirmed behavior, the remaining limitation, and the next revision target.`
		],
		() => [
			`- ${studioLabel} has a stated starting condition, expected result, observed result, and interpretation.`,
			`- ${studioLabel} uses one normal path and one altered condition to check whether the concept transfers.`,
			`- The ${studioLabel} review connects the evidence to the course idea instead of only reporting that it worked.`
		],
		() => [
			`- ${studioLabel} identifies the artifact or answer being produced and the signal that proves it is complete.`,
			`- ${studioLabel} checks the happy path plus one value, input, state, or assumption that could break it.`,
			`- The ${studioLabel} notes preserve enough context to rerun or re-explain the result later.`
		],
		() => [
			`- ${studioLabel} names the observable result and the evidence used to judge it.`,
			`- ${studioLabel} includes at least one comparison against a boundary, alternate input, or likely misconception.`,
			`- The ${studioLabel} conclusion states what the evidence supports and what it does not prove.`
		],
		() => [
			`- ${studioLabel} identifies the main skill, the artifact or answer, and the evidence that connects them.`,
			`- ${studioLabel} tests one expected case and one case that changes an input, constraint, or assumption.`,
			`- The ${studioLabel} wrap-up names what was reliable, what was fragile, and what would be changed next.`
		],
		() => [
			`- ${studioLabel} records the intended result before checking the observed result.`,
			`- ${studioLabel} includes a second check that is not just the prompt's sample or default condition.`,
			`- The ${studioLabel} explanation separates evidence, interpretation, and remaining uncertainty.`
		],
		() => [
			`- ${studioLabel} can be reviewed from its output, notes, test, trace, diagram, or other concrete evidence.`,
			`- ${studioLabel} checks a normal path and one path where the rule, state, or assumption changes.`,
			`- The ${studioLabel} final response explains why the result meets the stated concept.`
		],
		() => [
			`- ${studioLabel} makes the success condition visible before optional extensions are added.`,
			`- ${studioLabel} verifies the expected case and one case likely to expose a weak assumption.`,
			`- The ${studioLabel} review names the strongest evidence and the next most useful improvement.`
		],
		() => [
			`- ${studioLabel} has a concrete output or explanation that can be compared with the goal.`,
			`- ${studioLabel} includes one follow-up check that changes the data, input, model, rule, or state.`,
			`- The ${studioLabel} closing note identifies one confirmed idea and one limitation.`
		],
		() => [
			`- ${studioLabel} names the requirement being checked and the evidence used to check it.`,
			`- ${studioLabel} tests one standard case and one less comfortable case before extension work begins.`,
			`- The ${studioLabel} summary records what changed during the build and why it matters.`
		]
	]);
}

function studioExtensionPrompt(context: CourseTextContext) {
	const source = contextText(context);

	if (isScratchSource(source)) {
		return variantPrompt(context, [
			() =>
				"Add one feedback cue so the player can tell which state changed.",
			() =>
				"Add a broadcast, backdrop change, or sprite interaction that reuses the same event logic.",
			() =>
				"Add one difficulty option by changing a timer, score, speed, clone rule, or reset condition.",
			() =>
				"Add one extra play path and explain which variable, broadcast, or event block controls it."
		]);
	}
	if (isPygameSource(source)) {
		return variantPrompt(context, [
			() =>
				"Add one actor, level state, collision rule, or scoring rule while keeping the game loop readable.",
			() =>
				"Add a debug display that exposes position, velocity, collision, score, health, or state data.",
			() =>
				"Add one input mode or difficulty curve without hiding the main state updates.",
			() =>
				"Add one boundary test for startup, controls, collision, scoring, reset, or end-state behavior."
		]);
	}
	if (isSwiftAppContext(context)) {
		return variantPrompt(context, [
			() =>
				"Add one small view, state transition, navigation path, or persistence check.",
			() =>
				"Add one loading, empty, invalid, or offline state and verify the simulator behavior.",
			() =>
				"Add one accessibility improvement such as a label, trait, contrast check, or Dynamic Type check.",
			() =>
				"Add one release-readiness check that records build, signing, asset, or preview evidence."
		]);
	}
	if (isSecurityContext(context)) {
		return variantPrompt(context, [
			() =>
				"Add one defensive verification step that proves the mitigation or hardening change works.",
			() =>
				"Add one allowed failure-path test and document the evidence without expanding the lab scope.",
			() =>
				"Add a rollback, reset, detection, or monitoring step tied to the same local scenario.",
			() =>
				"Add one scope note that states what is intentionally not tested and why."
		]);
	}
	if (isSystemsContext(context)) {
		return variantPrompt(context, [
			() =>
				"Add one diagnostic command and the expected output that confirms the system state.",
			() =>
				"Add one failure-mode check and record the command that separates it from the healthy state.",
			() =>
				"Add a rollback, cleanup, logging, permission, service, memory, or process check.",
			() =>
				"Add one trace or sanitizer-style check that can be rerun from a clean shell."
		]);
	}
	if (isWebContext(context)) {
		return variantPrompt(context, [
			() =>
				"Add one loading, empty, invalid, or error state and verify it in the browser.",
			() =>
				"Add one responsive layout or accessibility check that changes the observable result.",
			() =>
				"Add one user-flow variation that changes input, state, API behavior, or persistence.",
			() =>
				"Add one console, network, or server-side verification step for the same user action."
		]);
	}
	if (isDataAiMlContext(context)) {
		const subject = supportFocusTopic(context);
		const subjectReference = articleSafeStudioReference(subject);

		return variantPrompt(context, [
			() =>
				"Add one baseline, sanity check, hand-checkable example, or limitation note.",
			() =>
				`Add a second metric, comparison, or visualization for ${subjectReference} and explain what it changes.`,
			() =>
				"Add one data-quality check for missing values, outliers, labels, leakage, or sampling bias.",
			() =>
				"Add one interpretation note that separates evidence from speculation."
		]);
	}
	if (isJavaContext(context) && !isCppContext(context)) {
		const subjectReference = articleSafeStudioReference(
			supportFocusTopic(context)
		);

		return variantPrompt(context, [
			() =>
				`Add one method, subclass, interface, record, collection case, or edge-case test for ${subjectReference}.`,
			() =>
				`Add one object-state or method-dispatch trace for ${subjectReference} that proves the intended behavior.`,
			() =>
				`Add one invalid-input, boundary, or overload case that protects the ${subjectReference} class contract.`,
			() =>
				`Add one small refactor for ${subjectReference} that improves responsibility boundaries without changing public behavior.`,
			() =>
				`Add one constructor, accessor, mutator, equals-style, or toString-style case for ${subjectReference} and explain what behavior it protects.`,
			() =>
				`Add one test for ${subjectReference} that changes object state through a public method, then verify the expected state without relying on hidden fields.`,
			() =>
				`Add one collection or array variation for ${subjectReference} and explain how the loop, index, or enhanced-for behavior changes the result.`,
			() =>
				`Add one interface, abstract-class, inheritance, or record variation for ${subjectReference} only if it clarifies the object responsibility.`
		]);
	}
	if (isCppContext(context)) {
		return variantPrompt(context, [
			() =>
				"Add one debug mode, benchmark, sanitizer check, lifetime-boundary test, or invalid-input case.",
			() =>
				"Add one trace that exposes a pointer, reference, ownership, memory, or performance decision.",
			() =>
				"Add one build, debugger, logging, or test command that confirms the low-level behavior.",
			() =>
				"Add one resource-boundary check and record the diagnostic evidence."
		]);
	}

	return variantPrompt(context, [
		() => "Add one changed constraint that still uses the same core idea.",
		() =>
			"Add one transfer case that changes the input, representation, or success condition.",
		() =>
			"Add one verification example that would catch a different mistake than the baseline case.",
		() =>
			"Add one small feature and explain which concept it reuses rather than only decorating the output."
	]);
}

function compactStudioSupportText(
	text: string,
	studioLabel = "",
	reference = "the work",
	runGenericCleanup = true
) {
	let compacted = text;

	if (studioLabel) {
		const escapedLabel = escapeStringForRegExp(studioLabel);
		const capitalizedReference = capitalizeSentence(reference);

		compacted = compacted
			.replace(new RegExp(`\\bFor ${escapedLabel},\\s*`, "g"), "")
			.replace(
				new RegExp(`\\bUse ${escapedLabel} to\\b`, "g"),
				`Use ${reference} to`
			)
			.replace(
				new RegExp(`\\bFrame ${escapedLabel} around\\b`, "g"),
				`Frame ${reference} around`
			)
			.replace(
				new RegExp(`\\bDefine ${escapedLabel} by\\b`, "g"),
				`Define ${reference} by`
			)
			.replace(
				new RegExp(`\\bKeep ${escapedLabel}\\s+`, "g"),
				`Keep ${reference} `
			)
			.replace(
				new RegExp(`\\bStart ${escapedLabel} with\\b`, "g"),
				"Start with"
			)
			.replace(
				new RegExp(`\\bCompile ${escapedLabel} after\\b`, "g"),
				`Compile ${reference} after`
			)
			.replace(
				new RegExp(`\\bVerify ${escapedLabel} with\\b`, "g"),
				`Verify ${reference} with`
			)
			.replace(
				new RegExp(`\\bCheck ${escapedLabel} against\\b`, "g"),
				`Check ${reference} against`
			)
			.replace(
				new RegExp(`\\bCompare ${escapedLabel} against\\b`, "g"),
				`Compare ${reference} against`
			)
			.replace(
				new RegExp(`\\bAfter ${escapedLabel} works\\b`, "g"),
				"After it works"
			)
			.replace(
				new RegExp(`\\bFinish ${escapedLabel} by\\b`, "g"),
				"Finish by"
			)
			.replace(
				new RegExp(`\\b${escapedLabel} demonstrates\\b`, "g"),
				`${capitalizedReference} demonstrates`
			)
			.replace(
				new RegExp(`\\b${escapedLabel} checks\\b`, "g"),
				`${capitalizedReference} checks`
			)
			.replace(
				new RegExp(`\\b${escapedLabel} includes\\b`, "g"),
				`${capitalizedReference} includes`
			)
			.replace(
				new RegExp(`\\b${escapedLabel} requirements\\b`, "g"),
				`${reference} requirements`
			)
			.replace(
				new RegExp(`\\bThe ${escapedLabel} protected boundary\\b`, "g"),
				"The protected boundary"
			)
			.replace(new RegExp(`^${escapedLabel}:\\s*`, "g"), "")
			.replace(new RegExp(`\\b${escapedLabel}\\b`, "g"), reference);
	}

	if (!runGenericCleanup) return compacted;

	return compacted
		.replace(/\b(the (?:studio|lab|work)) \([^)]{3,80}\)/gi, "$1")
		.replace(
			/\b(one|each|every|first|second|third|another) the (?:studio|lab|work) ([a-z])/gi,
			"$1 $2"
		)
		.replace(
			/\b(a|an) (small|compact|simple|focused|minimal|ordinary|standard) the (studio|lab|work) ([a-z])/gi,
			"$1 $2 $3 $4"
		)
		.replace(/\b(a|an) the (?:studio|lab|work) ([a-z])/gi, "$1 $2")
		.replace(
			/\bthe (studio|lab|work) (normal|ordinary|standard|expected|main|final|latest|last) behavior\b/gi,
			(_match, noun: string, adjective: string) =>
				`${adjective} ${noun} behavior`
		)
		.replace(
			/\bthe (studio|lab|work) (class|constructor|method|object|public|data|state|model|driver|fields|requirements|hypothesis|question|source|result|conclusion|summary|startup)\b/gi,
			(_match, noun: string, descriptor: string) =>
				`the ${noun}'s ${descriptor}`
		)
		.replace(
			/\b(?:A|a) (?:the )?(?:studio|lab|work) intermediate\b/g,
			"An intermediate"
		)
		.replace(/\bthe the\b/gi, "the")
		.replace(/\b(the|a|an) The ([A-Z])/g, "$1 $2")
		.replace(/\b(The|A|An) The ([A-Z])/g, "$1 $2")
		.replace(/\b(one|each|every) The ([A-Z])/g, "$1 $2")
		.replace(
			/\b(For|After|Before|When|If|While|Once|Until|With|From|Against|Use|Frame|Separate|Start|Define|Keep|Expose|Verify|Compare|Check|Show|Name|State|Make|Include|Add|Trace|Record|Retest|Build|Test|Run|Compile|Collect|Connect) The ([A-Z])/g,
			"$1 the $2"
		)
		.replace(
			/(^|\n)- ([a-z])/g,
			(_match, prefix: string, first: string) =>
				`${prefix}- ${first.toUpperCase()}`
		)
		.replace(/^[a-z]/, first => first.toUpperCase());
}

function studioSupport(context: CourseTextContext) {
	const studioLabel = studioContextLabel(context);
	const scopedSubject = scopedItemSubject(context);
	const itemTitle = stripLessonTitlePrefix(context.item.title);
	const moduleTitle = stripLessonTitlePrefix(context.module.title);
	const studioLabelAliases = [
		studioLabel,
		scopedSubject ? compactStudioContextTitle(scopedSubject) : "",
		compactStudioContextTitle(`${itemTitle} (${moduleTitle})`),
		compactStudioContextTitle(itemTitle)
	]
		.filter(
			(alias, index, aliases) => alias && aliases.indexOf(alias) === index
		)
		.sort((a, b) => b.length - a.length);
	const supportLabel = /applied lab|lab \d+/i.test(
		`${context.module.title} ${context.item.title}`
	)
		? "Applied lab"
		: "Applied studio";
	const supportNoun = supportLabel === "Applied lab" ? "lab" : "studio";
	const rawStudioReference = compactStudioContextTitle(context.module.title);
	const itemReference = compactStudioContextTitle(itemTitle);
	let studioReference = rawStudioReference;
	if (
		itemReference &&
		rawStudioReference.toLowerCase().includes(itemReference.toLowerCase())
	) {
		studioReference = "";
	}
	if (!studioReference) {
		studioReference =
			supportLabel === "Applied lab" ? "this lab" : "this studio";
	}
	const compactStudioReference =
		supportLabel === "Applied lab" ? "the lab" : "the studio";
	const sentenceStudioReference = capitalizeSentence(compactStudioReference);
	const supportSubject = studioSupportSubject(context, supportNoun);
	const compactStudio = (text: string) =>
		compactStudioSupportText(
			studioLabelAliases.reduce(
				(compacted, alias) =>
					compacted.includes(alias)
						? compactStudioSupportText(
								compacted,
								alias,
								compactStudioReference,
								false
							)
						: compacted,
				text
			),
			"",
			compactStudioReference
		);
	const compactScopedStudio = (text: string) => compactStudio(text);
	const pathTitle =
		`${itemTitle} ${context.item.projectLink ?? ""}`.toLowerCase();
	const studioFocus = variantPrompt(context, [
		() =>
			`For ${compactStudioReference}, name the minimum working version first, then add extensions only after the required behavior is testable; the work connects prerequisite ideas to a concrete result, a testable constraint, and a visible review point.`,
		() =>
			`For ${compactStudioReference}, define the artifact, prerequisite concepts, success criteria, and evidence before adding polish.`,
		() =>
			`Frame ${compactStudioReference} around one observable result, the constraints that shape it, and the evidence that confirms it works.`,
		() =>
			`Separate ${compactStudioReference} setup, core behavior, edge cases, and review notes so the finished artifact can be inspected later.`,
		() =>
			`Build the smallest complete version of ${compactStudioReference} first, then record evidence that shows it meets the named requirements.`,
		() =>
			`Connect ${compactStudioReference} prerequisites to a concrete result, a testable constraint, and a visible review point.`,
		() =>
			`Define ${compactStudioReference} by its required behavior, verification evidence, likely edge case, and final explanation target.`,
		() =>
			`Keep ${compactStudioReference} organized around setup, implementation, verification, and one improvement or limitation.`,
		() =>
			`Use ${compactStudioReference} to make the course concept visible through one artifact, one test case, and one explanation.`,
		() =>
			`Treat ${compactStudioReference} as a compact build: define the result, check the result, then name the next safe change.`,
		() =>
			`Anchor ${compactStudioReference} in one observable behavior and one evidence source before adding optional complexity.`,
		() =>
			`Make ${compactStudioReference} reviewable by naming the artifact, success signal, boundary case, and follow-up note.`
	]);
	const reviewTarget = compactStudioReference;
	const reviewStep = variantPrompt(context, [
		() =>
			`Compare ${reviewTarget}'s latest run with the original goal and record one concrete improvement or bug fix.`,
		() =>
			`Use the success criteria to choose one ${reviewTarget} revision that improves correctness, clarity, or robustness.`,
		() =>
			`Once ${reviewTarget} works, name one mismatch, limitation, or design choice that can guide a later revision.`,
		() =>
			`Finish ${reviewTarget} by naming one test result, one improvement made, and one remaining constraint.`,
		() =>
			`Review ${reviewTarget} by comparing the intended behavior with the evidence collected during the final run.`,
		() =>
			`Before extending ${reviewTarget}, record one confirmed behavior and one assumption that still needs care.`,
		() =>
			`Close ${reviewTarget} with a short note naming what was verified, what changed, and what would be revised next.`,
		() =>
			`Use ${reviewTarget}'s last run to identify one successful path, one fragile path, and one concrete follow-up.`,
		() =>
			`Record one ${reviewTarget} result that matched the target and one result that needed adjustment or explanation.`,
		() =>
			`Summarize ${reviewTarget} with the tested case, the evidence source, and the next change that would most improve it.`,
		() =>
			`Check whether ${reviewTarget} still works under one changed condition before treating the activity as finished.`,
		() =>
			`Name the strongest ${reviewTarget} evidence, the weakest assumption, and the most useful follow-up revision.`,
		() =>
			`Compare ${reviewTarget} evidence with the course concept and record one point that became clearer during the build.`,
		() =>
			`End ${reviewTarget} with one confirmed behavior, one unresolved risk, and one practical improvement target.`
	]);
	const compactExtension = compactStudioSupportText(
		compactStudio(studioExtensionPrompt(context)),
		"",
		compactStudioReference
	);
	const studioIntro = isScratchSource(contextText(context))
		? `**${supportLabel}:** ${supportSubject} defines a Scratch project slice around ${unscopedSubjectFocus(context)}.`
		: `**${supportLabel}:** ${supportSubject} produces ${studioArtifact(context)} connected to ${unscopedSubjectFocus(context)}.`;
	const studioPath = (() => {
		if (pathTitle.includes("build requirements")) {
			return `Build path for ${compactStudioReference}: define the required parts, connect them into one runnable artifact, and verify the complete path rather than isolated pieces.`;
		}
		if (
			pathTitle.includes("common bug") ||
			pathTitle.includes("debugging")
		) {
			return `Debug path for ${compactStudioReference}: reproduce one realistic failure, name the suspected cause, change the smallest relevant script or state rule, and verify the fix.`;
		}
		if (
			pathTitle.includes("share and explain") ||
			pathTitle.includes("presentation")
		) {
			return `Explanation path for ${compactStudioReference}: connect the finished behavior to the main event chain, state variable, design choice, and remaining limitation.`;
		}
		if (
			pathTitle.includes("design and planning") ||
			pathTitle.includes("planning map")
		) {
			return `Planning path for ${compactStudioReference}: map the pieces, first runnable checkpoint, verification evidence, and one likely risk before implementation expands.`;
		}
		if (pathTitle.includes("worked example")) {
			return `Model path for ${compactStudioReference}: setup, one hand-checkable trace, expected output, and the reason the result is trustworthy.`;
		}
		if (pathTitle.includes("core project")) {
			return `Required build path for ${compactStudioReference}: complete the required artifact first, then verify the standard case and one boundary case.`;
		}
		if (pathTitle.includes("review")) {
			return `Review path for ${compactStudioReference}: inspect the result, name one limitation or bug risk, and record the next improvement.`;
		}
		if (
			pathTitle.includes("transfer") ||
			pathTitle.includes("supplemental 2")
		) {
			return `Transfer path for ${compactStudioReference}: change one dataset, constraint, representation, or context and compare what still works.`;
		}
		if (
			pathTitle.includes("extension") ||
			pathTitle.includes("challenge") ||
			pathTitle.includes("supplemental 3")
		) {
			return `Extension path for ${compactStudioReference}: add a harder case, second metric, alternate representation, or deeper limitation check after the base version works.`;
		}

		return variantPrompt(context, [
			() =>
				`${sentenceStudioReference} connects the activity goal to a visible artifact, verification evidence, and one limitation that can be inspected later.`,
			() =>
				`${sentenceStudioReference} starts from the intended result, then records the evidence, boundary behavior, and limitation that make the work reviewable.`,
			() =>
				`Use ${compactStudioReference} to produce a concrete result, verify it against the stated concept, and name one limitation before extending it.`,
			() =>
				`${sentenceStudioReference} leaves behind a runnable artifact, a specific verification note, and one improvement tied to the stated concept.`
		]);
	})();

	return [
		studioIntro,
		`**Path:** ${studioPath}`,
		`**Studio focus:** ${compactScopedStudio(studioFocus)}`,
		`**Build sequence:**\n${compactStudio(studioBuildSequence(context).join("\n"))}\n- ${compactScopedStudio(reviewStep)}`,
		`**Completion checks:**\n${compactStudio(studioCompletionChecks(context).join("\n"))}`,
		`**Extension:** ${compactExtension}`
	].join("\n\n");
}

function qualitySupportFor(context: CourseTextContext) {
	if (isCheckInContext(context)) return diagnosticSupport(context);
	if (isScienceContext(context)) return scienceSupport(context);
	if (isAppliedStudioContext(context)) return studioSupport(context);
	if (isProjectLikeItem(context.item)) return projectSupport(context);
	return lessonSupport(context);
}

function shortProjectReviewSupport(context: CourseTextContext) {
	const support = [
		`**Completion checks:**\n${compactGeneratedProjectSupport(context, completionChecks(context)).join("\n")}`,
		`**Extension:** ${compactGeneratedProjectSupport(context, [extensionPrompt(context)])[0]}`
	].join("\n\n");

	return isCheckInContext(context)
		? polishDiagnosticSupportText(support)
		: support;
}

function rewritePlaceholderCourseText(course: RawCourse, courseId: string) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };

				if (placeholderContentPattern.test(item.content)) {
					item.content = studioSupport(context);
					continue;
				}

				if (
					isAppliedStudioContext(context) &&
					wordCount(item.content) < 90
				) {
					item.content = `${supportBaseContent(item.content)}\n\n${studioSupport(context)}`;
				}
			}
		}
	}
}

function contextualizeGenericRepresentationPrompt(context: CourseTextContext) {
	if (
		!isScienceContext(context) ||
		!/graph|diagram|data/i.test(context.item.title)
	) {
		return context.item.content;
	}

	const moduleLabel = compactStudioContextTitle(context.module.title);
	if (!moduleLabel) return context.item.content;

	return context.item.content.replace(
		/^Represent the module with at least one graph, diagram sequence, or data table\./,
		`Create a representation for ${moduleLabel} with at least one graph, diagram sequence, or data table.`
	);
}

function cleanModuleTopicTitle(title: string) {
	return compactWhitespace(stripLessonTitlePrefix(title))
		.replace(/^[A-Z]{1,4}\d+\s+/u, "")
		.replace(/^Module Project:\s*/iu, "")
		.replace(/\s+\([^)]*\)$/u, "");
}

function mathModuleBackboneSupport(context: CourseTextContext) {
	const topic = cleanModuleTopicTitle(context.module.title) || "this module";

	return [
		`**Concept path:** ${topic} connects the main rule or representation to worked examples, then checks the result through substitution, graph or table interpretation, units, or reasonableness.`,
		`**Failure modes:** In ${topic}, common errors include copying a pattern without checking the condition, dropping a sign or exponent, skipping domain or unit restrictions, or reporting an answer without explaining what it means.`,
		`**Mastery check:** A complete response states the setup, shows the algebraic or representational move, verifies the answer in context, and explains one case where the same method would need to change.`
	].join("\n\n");
}

function addMissingMathModuleLessonBackbones(
	course: RawCourse,
	courseId: string
) {
	for (const module of course.modules) {
		if (module.kind === "appendix") continue;
		if (module.curriculum.length === 0) continue;
		if (
			module.curriculum.some(item =>
				visibleLessonBackbonePattern.test(item.content)
			)
		) {
			continue;
		}

		const item = module.curriculum[0];
		const context = {
			courseId,
			course,
			module,
			item,
			section: "curriculum" as const
		};
		if (!isMathContext(context)) continue;

		item.content = `${supportBaseContent(item.content)}\n\n${mathModuleBackboneSupport(context)}`;
	}
}

function normalizeCourseTextQuality(course: RawCourse, courseId: string) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };
				item.content =
					contextualizeGenericRepresentationPrompt(context);

				if (needsPygameProjectCompletionSupport(context)) {
					item.content = `${supportBaseContent(item.content)}\n\n${pygameProjectCompletionSupport()}`;
				}

				if (!needsContentSupport(context)) {
					if (needsShortProjectReviewSupport(context)) {
						item.content = `${supportBaseContent(item.content)}\n\n${shortProjectReviewSupport(context)}`;
					}

					continue;
				}

				const currentContent = supportBaseContent(item.content);
				const support = qualitySupportFor(context);
				item.content = currentContent
					? `${currentContent}\n\n${support}`
					: support;

				if (needsShortProjectReviewSupport(context)) {
					item.content = `${supportBaseContent(item.content)}\n\n${shortProjectReviewSupport(context)}`;
				}
			}
		}
	}

	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };
				if (
					isScienceContext(context) &&
					!isInformationalResourceItem(item) &&
					!scienceEvidencePattern.test(item.content)
				) {
					item.content = `${supportBaseContent(item.content)}\n\n${scienceEvidenceCheckpoint(context)}`;
				}
			}
		}
	}

	addMissingMathModuleLessonBackbones(course, courseId);
}

function normalizeImplementationLabLanguage(course: RawCourse) {
	const titlePattern = /:\s*Implementation (?:Studio|Lab)\b/g;
	const implementationLabelPattern = /\bImplementation (?:Studio|Lab)\b/g;
	const patternImplementationTitlePattern = /\bPattern Implementation Lab\b/g;
	const definesPattern =
		/[^.!?\n]+: (?:Implementation|Applied) Lab defines the target artifact, required behavior, and core concepts needed for the build or problem set\./g;
	const centersPattern =
		/[^.!?\n]+: (?:Implementation|Applied) Lab centers on one complete artifact\. The build sequence moves from a minimal working version to one targeted improvement or edge-case pass\./g;
	const closesPattern =
		/[^.!?\n]+: (?:Implementation|Applied) Lab closes with the edge cases that matter most and one improvement for a cleaner or safer next iteration\./g;
	const extensionPattern =
		/Extend the core build from [^.!?\n]+: (?:Implementation|Applied) Lab with/g;
	const supplementalPattern =
		/Supplemental project connected to [^.!?\n]+: (?:Implementation|Applied) Lab\. The linked starter provides the implementation artifact, and the solution provides the reference state\./g;
	const genericSupplementalPattern =
		/Supplemental project connected to [^.!?\n]+\. The linked starter provides the implementation artifact, and the solution provides the reference state\./g;

	for (const module of course.modules) {
		module.title = module.title
			.replace(patternImplementationTitlePattern, "Pattern Applied Lab")
			.replace(titlePattern, " applied lab");
		module.title = cleanAppliedLabDisplayTitle(module.title);

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.title = item.title
					.replace(
						patternImplementationTitlePattern,
						"Pattern Applied Lab"
					)
					.replace(titlePattern, " applied lab")
					.replace(implementationLabelPattern, "Applied lab");
				item.title = cleanAppliedLabDisplayTitle(item.title);
				item.content = item.content
					.replace(
						patternImplementationTitlePattern,
						"Pattern Applied Lab"
					)
					.replace(
						definesPattern,
						"This lab defines the artifact, required behavior, and core concepts for the project or problem set. Use it to name the inputs, outputs, constraints, and evidence of correctness before implementation begins."
					)
					.replace(
						centersPattern,
						"This lab centers on one complete artifact. Build the smallest working version first, then add one targeted improvement and one edge-case pass."
					)
					.replace(
						closesPattern,
						"This review closes the lab by checking the edge cases that matter most, naming one bug or limitation, and recording one improvement for the next iteration."
					)
					.replace(extensionPattern, "Extend the core build with")
					.replace(
						supplementalPattern,
						"Use this supplemental task as adjacent practice. The linked repository gives a starting point; any reference link shows one complete solution path. Focus on the same core idea while handling a different data layout, constraint, or edge case."
					)
					.replace(
						genericSupplementalPattern,
						"Use this supplemental task as adjacent practice. The linked repository gives a starting point; any reference link shows one complete solution path. Focus on the same core idea while handling a different data layout, constraint, or edge case."
					)
					.replace(titlePattern, " applied lab")
					.replace(implementationLabelPattern, "Applied lab");
				item.content = cleanAppliedLabReferenceText(item.content);
			}
		}
	}
}

function normalizeApComputerScienceA(course: RawCourse) {
	course.modules = orderedModules(course, [
		"General: Course Introduction and Setup",
		"APCS1 Variables and Input/Output",
		"APCS2 Operators",
		"APCS3 Conditionals and Packages",
		"APCS4 Loops and Exceptions",
		"Check-In #1",
		"APCS5 Classes Part I",
		"APCS6 Classes Part II",
		"APCS7 Inheritance",
		"APCS8 Polymorphism",
		"Check-In #2",
		"APCS9 Software Development Lifecycle",
		"APCS10 Arrays",
		"APCS11 ArrayLists",
		"Check-In #3",
		"APCS12 Wrapper Classes",
		"APCS13 Algorithmic Runtime and Linear Search",
		"APCS14 Selection and Insertion Sort",
		"APCS15 Recursion",
		"APCS16 Binary Search and Merge Sort",
		"Check-In #4",
		"APCS17 Master Projects and Test Prep"
	]);
}

function normalizeAlgebra1A(course: RawCourse) {
	course.modules = orderedModules(course, [
		"Algebra 1A Kick-Off Projects",
		"AA1 Algebraic Properties",
		"AA2 Solving Single-Step Linear Equations",
		"AA3 Module Project: Movie Star Status (with Maddie Van Beek)",
		"AA4 Solving Multi-Step Linear Equations",
		"AA5 Module Project: Free Swag! (with Amisha Sisodiya)",
		"Check-in #1",
		"AA6 Slope and Rate of Change",
		"AA7 Module Project: Community Data Analysis (with Davin Lee)",
		"AA8 Slope-Intercept Form",
		"AA9 Point-Slope Form",
		"AA10 Graphing Inequalities",
		"AA11 Module Project: Predicting Avalanches (with Ruby Lee)",
		"Check-in #2",
		"AA12 Solving Linear Systems by Graphing",
		"AA13 Solving Linear Systems by Substitution",
		"AA14 Solving Linear Systems by Elimination",
		"AA15 Module Project: Cytogenetics Quest (with Dr. Renu Bajaj)",
		"AA16 Module Project: Battle of the Publications (with Konstantin Kaganovsky)",
		"Check-in #3",
		"AA17 Master Project: Algebra 1A"
	]);
}

function normalizeAlgebra1B(course: RawCourse) {
	course.modules = orderedModules(course, [
		"Algebra 1B Kick-Off Project",
		"AB1 Introduction to Polynomials",
		"AB2 Multiplying Polynomials",
		"AB3 Fractions with Polynomials",
		"AB4 Module Project: Smart and Elegant (with Amy Katz)",
		"AB5 Solving Quadratics by Factoring",
		"AB6 Special Factorizations",
		"AB7 Solving Quadratics by Completing the Square",
		"AB8 Quadratic Formula",
		"AB9 Module Project: The Half-Court Challenge (with Ian Kennedy)",
		"Check-in #1",
		"AB10 Graphing Vertex Form",
		"AB11 Graphing Standard Form",
		"AB12 Transformations",
		"AB13 Module Project: Put Me in Coach! (with Tom Dethlefs)",
		"AB14 Introduction to Functions",
		"AB15 Function Composition and Inverse Functions",
		"AB16 Module Project: J.T. Phone Home",
		"AB17 Absolute Value and Exponential Functions",
		"AB18 Direct and Inverse Variation",
		"AB19 Data Modeling",
		"AB20 Module Project: The Mysteries of Light (with Blake Eaton)",
		"AB21 Module Project: Radiofungi (with Sunanda Sharma)",
		"Check-in #2",
		"AB22 Master Project: Algebra 1B"
	]);
}

function normalizeJavaScriptLevel1(course: RawCourse) {
	course.modules = orderedModules(course, [
		"JSS1 Variables and Data Types",
		"JSS2 Operators and Math",
		"JSS3 For and While Loops",
		"JSS4 Combining Loops and Variables",
		"JSS5 Conditionals",
		"JSS6 Advanced Conditionals",
		"JSS7 Drawing in JavaScript",
		"JSS8 Nested Loops",
		"Check-In #1",
		"JSS9 Introduction to HTML & CSS",
		"JSS10 Animations in JavaScript",
		"JSS11 More HTML & CSS",
		"JSS12 Basic Website Layout",
		"JSS13 The Grid Layout",
		"JSS14 Dynamic Websites with JavaScript",
		"Check-In #2",
		"JSS15 Master Project"
	]);
}

function normalizeJavaScriptLevel2(course: RawCourse) {
	course.modules = orderedModules(course, [
		"JSM1 Fundamentals Review",
		"JSM2 Functions",
		"JSM3 Complex Conditionals",
		"JSM4 Canvas",
		"JSM5 Arrays and Iterators",
		"JSM6 Objects and Properties",
		"Check-In #1",
		"JSM7 Helper Functions and Event Listeners",
		"JSM8 Collisions and Controls",
		"JSM9 Games in the Canvas",
		"JSM10 APIs and Requests",
		"JSM11 SQL and Schemas",
		"JSM12 NoSQL and CRUD",
		"Check-In #2",
		"JSM13 Message Board",
		"JSM14 Quiz Game",
		"JSM15 Master Project"
	]);
}

function normalizePythonLevel1(course: RawCourse) {
	setItemLinks(course, "Check-In #2", "Check-In #2 Overview", {
		solutionLink: githubTree(
			"Python-Level-1",
			"GRS-Check-in-Two-Updated/solution"
		)
	});
	setItemLinks(
		course,
		"Check-In #2",
		"Check-In #2: Additional Practice Project",
		{
			projectLink: githubTree(
				"Python-Level-1",
				"Check-in-Two-Practice-Project/starter"
			),
			solutionLink: githubTree(
				"Python-Level-1",
				"Check-in-Two-Additional-Practice-ProjectUpdated/solution"
			)
		}
	);
	setItemLinks(course, "Check-In #3", "Check-In #3 Overview", {
		solutionLink: githubTree(
			"Python-Level-1",
			"GRS-Check-in-Three-Updated/solution"
		)
	});
}

function applyCourseLearningPaths(course: RawCourse) {
	for (const module of course.modules) {
		if (module.kind === "appendix") continue;

		for (const item of module.curriculum) {
			item.learningPath ??= "core";
		}
		for (const item of module.supplementalProjects) {
			item.learningPath ??= /transfer practice/i.test(item.title)
				? "challenge"
				: "choice";
		}
	}
}

interface ClassroomChallengePair {
	normal: string;
	hard: string;
}

function pythonLevel1ClassroomChallenges(
	moduleTitle: string
): ClassroomChallengePair {
	const normalizedTitle = moduleTitle.toLowerCase();

	if (/coordinates|movement/.test(normalizedTitle)) {
		return {
			normal: "Add one visible movement, shape, or filled feature with the provided Turtle and coordinate setup",
			hard: "Add a multi-part feature that moves between coordinates without accidental connecting lines"
		};
	}
	if (/variables|random/.test(normalizedTitle)) {
		return {
			normal: "Use one named variable or random choice to control a visible project feature",
			hard: "Coordinate several variables or bounded random values so the result changes while remaining readable"
		};
	}
	if (/conditionals/.test(normalizedTitle)) {
		return {
			normal: "Add one condition that changes a visible action when a clear test becomes true",
			hard: "Add ordered or compound conditions and verify normal, boundary, and alternate cases"
		};
	}
	if (/nested loops/.test(normalizedTitle)) {
		return {
			normal: "Add one inner loop that repeats a small feature inside the existing outer pattern",
			hard: "Use two loop variables to control different visual properties and explain the total repetition count"
		};
	}
	if (/loops/.test(normalizedTitle)) {
		return {
			normal: "Add one counted or condition-controlled loop for a repeated visual feature",
			hard: "Make the loop depend on a changing variable and test a small, typical, and boundary value"
		};
	}
	if (/functions/.test(normalizedTitle)) {
		return {
			normal: "Complete one function that owns a clear drawing or interaction responsibility",
			hard: "Add parameters or a return value so the same function supports several visibly different results"
		};
	}
	if (/event listeners/.test(normalizedTitle)) {
		return {
			normal: "Complete one key or click action and confirm the matching event listener calls it",
			hard: "Add another control that changes shared state without breaking focus, clearing, or existing controls"
		};
	}
	if (/lists/.test(normalizedTitle)) {
		return {
			normal: "Use a list of colors, positions, sizes, or Turtle objects in one visible feature",
			hard: "Update, cycle, or filter the list while keeping every index and empty-list case safe"
		};
	}
	if (/game mechanics|space eater/.test(normalizedTitle)) {
		return {
			normal: "Complete one movement, boundary, scoring, target, or collision feature in the running game",
			hard: "Add a coordinated game-state rule with visible feedback plus a reliable reset or replay path"
		};
	}
	if (/master project/.test(normalizedTitle)) {
		return {
			normal: "Finish one playable vertical slice with controls, a goal, visible feedback, and a restart path",
			hard: "Add one planned system such as scoring, levels, stored objects, difficulty changes, or richer collision rules"
		};
	}
	if (/check-in/.test(normalizedTitle)) {
		return {
			normal: "Complete the required case and record one run or trace that demonstrates the checked skill",
			hard: "Change one input, rule, or boundary and explain why the same solution still works or needs revision"
		};
	}

	return {
		normal: "Add one clearly visible feature that satisfies the central project requirement",
		hard: "Add a second coordinated feature that reuses course concepts without breaking the completed framework"
	};
}

function pythonLevel2ClassroomChallenges(
	moduleTitle: string
): ClassroomChallengePair {
	const normalizedTitle = moduleTitle.toLowerCase();

	if (/variables|strings|input/.test(normalizedTitle)) {
		return {
			normal: "Add one clearly named input, transformation, or formatted output inside the completed program",
			hard: "Add input cleanup or validation and demonstrate ordinary, boundary, and invalid cases"
		};
	}
	if (/loops/.test(normalizedTitle)) {
		return {
			normal: "Complete one counted or condition-controlled repetition without changing the working setup",
			hard: "Add a loop invariant, early stop, or nested repetition and trace a small, typical, and boundary case"
		};
	}
	if (/ascii|cipher/.test(normalizedTitle)) {
		return {
			normal: "Add one character-to-number or number-to-character transformation and verify its output",
			hard: "Add wraparound, punctuation preservation, or a successful encode-decode round trip"
		};
	}
	if (/conditionals/.test(normalizedTitle)) {
		return {
			normal: "Complete one ordered decision with an explicit expected result for every valid branch",
			hard: "Add compound validation or another game rule and test normal, boundary, and invalid input"
		};
	}
	if (/functions/.test(normalizedTitle)) {
		return {
			normal: "Complete one function with a clear responsibility, parameters, and a used result",
			hard: "Refactor repeated work into another helper and verify each function independently before integration"
		};
	}
	if (/lists|music/.test(normalizedTitle)) {
		return {
			normal: "Use one safe list creation, lookup, update, or traversal inside the completed program",
			hard: "Coordinate multiple collections or add empty-list, duplicate, and boundary-index handling"
		};
	}
	if (/dictionaries/.test(normalizedTitle)) {
		return {
			normal: "Add one meaningful key-value lookup or update with a safe missing-key result",
			hard: "Build a nested or coordinated data model and explain why named keys fit better than positional indexes"
		};
	}
	if (/sets/.test(normalizedTitle)) {
		return {
			normal: "Use a set to add, remove, compare, or deduplicate values in one visible result",
			hard: "Combine set operations with another collection and test empty, duplicate, and disjoint cases"
		};
	}
	if (
		/to-do|bank account|type racer|wordsmith|blackjack/.test(
			normalizedTitle
		)
	) {
		return {
			normal: "Complete one user-facing command, scoring rule, state update, or validation path in the working application",
			hard: "Add persistence, replay, richer state, or another coordinated feature with a repeatable test matrix"
		};
	}
	if (/master project/.test(normalizedTitle)) {
		return {
			normal: "Finish one complete vertical slice with input, state, output, and a reliable reset or exit path",
			hard: "Add one planned subsystem while preserving clear function boundaries and regression tests for the working slice"
		};
	}
	if (/check-in/.test(normalizedTitle)) {
		return {
			normal: "Complete the required case and record one input-output trace that demonstrates the checked skill",
			hard: "Change one input, rule, or boundary and explain why the same solution still works or needs revision"
		};
	}

	return {
		normal: "Complete one clearly scoped data, function, or control-flow addition inside the working program",
		hard: "Add a second coordinated feature and verify it with ordinary, boundary, and invalid or empty cases"
	};
}

function pyGamesClassroomChallenges(
	moduleTitle: string
): ClassroomChallengePair {
	const normalizedTitle = moduleTitle.toLowerCase();

	if (/setup|editors|asset|images|sprites/.test(normalizedTitle)) {
		return {
			normal: "Add or configure one visible asset while preserving the working project structure and attribution",
			hard: "Add a second asset state or animation and verify missing-asset and reset behavior"
		};
	}
	if (/actors/.test(normalizedTitle) && !/advanced/.test(normalizedTitle)) {
		return {
			normal: "Add one visible Actor property or movement rule inside the running game",
			hard: "Coordinate multiple Actor states or velocities while keeping every boundary response stable"
		};
	}
	if (/event handling/.test(normalizedTitle)) {
		return {
			normal: "Complete one keyboard or mouse action and show the resulting state change on screen",
			hard: "Add another control, held-input behavior, or mode without breaking the existing event path"
		};
	}
	if (/advanced actors/.test(normalizedTitle)) {
		return {
			normal: "Add one ZRect, collision, or dynamic-attribute behavior to the completed scene",
			hard: "Coordinate collision state, feedback, and reset behavior across more than one Actor"
		};
	}
	if (/collectibles/.test(normalizedTitle)) {
		return {
			normal: "Add one list-managed object, collision rule, or score update that works for every collectible",
			hard: "Add another object type or level rule while keeping iteration, removal, and reset behavior safe"
		};
	}
	if (/physics/.test(normalizedTitle)) {
		return {
			normal: "Tune or add one named velocity, gravity, friction, or collision-response rule",
			hard: "Combine forces or multiple moving objects and verify bounded motion plus deterministic reset"
		};
	}
	if (/obstacles|surfaces|platform/.test(normalizedTitle)) {
		return {
			normal: "Add one platform, obstacle, or landing rule and verify standing, jumping, and falling cases",
			hard: "Add moving surfaces, hazards, or level layout while preventing false collision snaps"
		};
	}
	if (/levels|system control/.test(normalizedTitle)) {
		return {
			normal: "Complete one start, play, pause, end, or reset transition with visible feedback",
			hard: "Add level progression or timed state changes and verify every transition and replay path"
		};
	}
	if (/projectiles/.test(normalizedTitle)) {
		return {
			normal: "Add one firing, movement, collision, or reset rule for a working projectile",
			hard: "Manage a projectile list with spawning, collision, and complete offscreen cleanup"
		};
	}
	if (/enemy ai/.test(normalizedTitle)) {
		return {
			normal: "Add one readable sense-decide-act enemy behavior and visible response",
			hard: "Add phases, multiple enemy states, or coordinated projectiles without unbounded object growth"
		};
	}
	if (/ninja|space invaders|master project/.test(normalizedTitle)) {
		return {
			normal: "Finish one playable vertical slice with controls, update, draw, collision, feedback, and restart",
			hard: "Add one planned game subsystem while keeping object cleanup and every state transition reliable"
		};
	}
	if (/check-in/.test(normalizedTitle)) {
		return {
			normal: "Complete the required playable case and record the input, state change, and visible result",
			hard: "Change one rule, boundary, or object count and explain why the same system still works or needs repair"
		};
	}

	return {
		normal: "Add one clearly visible and playable feature inside the completed game framework",
		hard: "Add a second coordinated game system without breaking input, update, draw, collision, or reset behavior"
	};
}

function classroomChallenges(
	courseId: string,
	moduleTitle: string
): ClassroomChallengePair {
	if (courseId === "python-level-2-classroom") {
		return pythonLevel2ClassroomChallenges(moduleTitle);
	}
	if (courseId === "pygames-classroom") {
		return pyGamesClassroomChallenges(moduleTitle);
	}
	return pythonLevel1ClassroomChallenges(moduleTitle);
}

function isClassroomProject(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	if (module.kind === "appendix") return false;

	return (
		!!item.projectLink ||
		!!item.solutionLink ||
		/\b(?:project|practice|exploration|recap)\b/i.test(item.title) ||
		/^Check-In #\d+:/i.test(item.title)
	);
}

function pythonLevel1ClassroomTemplate(itemTitle: string) {
	if (/Color Circle Art/i.test(itemTitle)) return "circle-art";
	if (/Picasso/i.test(itemTitle)) return "picasso";
	if (/Triangle Motion|Basic Shapes/i.test(itemTitle))
		return "triangle-motion";
	if (/Random Walk|Neon Trail/i.test(itemTitle)) return "neon-trail";
	if (/Fireworks?/i.test(itemTitle)) return "firework-festival";
	if (/Square Spiral|Spirals?/i.test(itemTitle)) return "spiral-galaxy";
	if (/Turtle Race/i.test(itemTitle)) return "turtle-race";
	if (/Rainbow Flower|Flower Garden/i.test(itemTitle)) return "flower-garden";
	if (/Stay Inbounds|Maze Explorer/i.test(itemTitle)) return "maze-explorer";
	return "classroom-project";
}

const PYGAMES_CLASSROOM_SOURCE_FILES: Record<string, string> = {
	"pyg1 project 1: rainbow fill": "PyG1-Rainbow-Fill.py",
	"pyg1 project 2: bouncing alien": "PyG1-Bouncing-Alien.py",
	"pyg1 project 3: wandering ball": "PyG1-Wandering-Ball.py",
	"pyg2 project 1: arrow point": "PyG2-Arrow-Point.py",
	"pyg2 project 2: apple collector": "PyG2-Apple-Collector.py",
	"pyg2 project 3: art box": "PyG2-Art-Box.py",
	"pyg3 project 1: zrect art": "PyG3-ZRect-Art.py",
	"pyg3 project 2: light control": "PyG3-Light-Control.py",
	"pyg3 project 3: beach ball chase": "PyG3-Beach-Ball-Chase.py",
	"pyg3 supplemental project 1: asteroid dodge": "PyG3-Asteroid-Dodge.py",
	"pyg4 project 1: bouncy ball room": "PyG4-Bouncy-Ball-Room.py",
	"pyg4 project 2: falling squares": "PyG4-Falling-Squares.py",
	"pyg4 project 3: jewel catch": "PyG4-Jewel-Catch.py",
	"pyg5 project 1: keep up": "PyG5-Keep-Up.py",
	"pyg5 project 2: golf": "PyG5-Golf.py",
	"pyg5 project 3: ball pit": "PyG5-Ball-Pit.py",
	"pyg6 project 1: stay on the platform": "PyG6-Stay-on-the-Platform.py",
	"pyg6 project 2: platformer game": "PyG6-Platformer-Game.py",
	"pyg6 project 3: falling jump": "PyG6-Falling-Jump.py",
	"pyg7 project 1: alien catch": "PyG7-Alien-Catch.py",
	"pyg7 project 2: beach ball dodge": "PyG7-Beach-Ball-Dodge.py",
	"pyg7 project 3: number count": "PyG7-Number-Count.py",
	"pyg8 project 1: target shoot": "PyG8-Target-Shoot.py",
	"pyg8 project 2: asteroid shoot": "PyG8-Asteroid-Shoot.py",
	"pyg9 project 1: shark chase (fish bowl)": "PyG9-Shark-Chase.py",
	"pyg9 project 2: space battle": "PyG9-Space-Battle.py",
	"pyg10 project 1: ninja versus alien": "PyG10-Ninja-Versus-Alien.py",
	"pyg11 project 1: space invaders": "PyG11-Space-Invaders.py",
	"pyg12 project 1: master project": "PyG12-Master-Project.py"
};

function pyGamesClassroomSourceUrl(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	const sourceFile = PYGAMES_CLASSROOM_SOURCE_FILES[item.title.toLowerCase()];
	if (sourceFile) {
		return `${INSTRUCTION_MATERIAL_BASE}/PyGames/blob/main/${sourceFile}`;
	}

	const checkInMatch = module.title.match(/^Check-In #([123]):/i);
	if (!checkInMatch?.[1]) return undefined;

	const checkInNumber = checkInMatch[1];
	if (/Additional Practice Project/i.test(item.title)) {
		const fileName =
			checkInNumber === "3"
				? "Check_in_3_Additional_Practice_Solution.py"
				: `Check-in-${checkInNumber}-Additional-Practice-Solution.py`;
		return `${INSTRUCTION_MATERIAL_BASE}/PyGames/blob/main/${fileName}`;
	}
	const fileName =
		checkInNumber === "1"
			? "Check-in-1-Solution.py"
			: `Check-in-${checkInNumber}-Starter.py`;
	return `${INSTRUCTION_MATERIAL_BASE}/PyGames/blob/main/${fileName}`;
}

function pythonLevel2ClassroomSourceUrl(module: RawCourseModule) {
	const checkInMatch = module.title.match(/^Check-In #([12])$/i);
	if (!checkInMatch?.[1]) return undefined;
	return githubTree(
		"Python-Level-2",
		`PS-Check-in-${checkInMatch[1]}/solution`
	);
}

function classroomSourceUrl(
	courseId: string,
	module: RawCourseModule,
	item: RawCourseModuleItem,
	originalProjectLink: string | undefined,
	template: string
) {
	if (
		courseId === "python-level-1-classroom" &&
		template !== "classroom-project"
	) {
		return undefined;
	}

	return (
		item.solutionLink ??
		originalProjectLink ??
		(courseId === "pygames-classroom"
			? pyGamesClassroomSourceUrl(module, item)
			: undefined) ??
		(courseId === "python-level-2-classroom"
			? pythonLevel2ClassroomSourceUrl(module)
			: undefined)
	);
}

function classroomIdeMode(courseId: string) {
	if (courseId === "python-level-1-classroom") return "turtle";
	return courseId === "pygames-classroom" ? "pgzero" : "python";
}

function classroomIdeLink(
	courseId: string,
	item: RawCourseModuleItem,
	template: string,
	starterUrl?: string
) {
	const projectId =
		item.id ||
		item.title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	const currentCourseId = CLASSROOM_BASE_COURSE_IDS[courseId] ?? courseId;
	const params = new URLSearchParams({
		classroom: "1",
		course: currentCourseId,
		mode: classroomIdeMode(courseId),
		projectKey: `${courseId}:${projectId}:starter`,
		starterLabel: "Classroom project",
		starterTitle: item.title,
		template
	});
	if (starterUrl?.startsWith("https://github.com/")) {
		params.set("starterUrl", starterUrl);
	}
	return `/python-ide?${params.toString()}`;
}

function replaceBeginnerLabel(value: string) {
	return value
		.replace(/\bBeginner\b/g, "Normal")
		.replace(/\bbeginner\b/g, "normal");
}

function adaptClassroomCourse(course: RawCourse, courseId: string) {
	course.name = replaceBeginnerLabel(course.name);

	for (const module of course.modules) {
		module.title = replaceBeginnerLabel(module.title);

		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = replaceBeginnerLabel(item.title);
			item.content = replaceBeginnerLabel(item.content);
			if (!isClassroomProject(module, item)) {
				const classroomUse =
					module.kind === "appendix"
						? "Use this reference when a Normal or Hard project card calls for the related concept, source, or example"
						: "Use this lesson to prepare for the next Normal build and to identify which completed framework code the class can safely reuse";
				item.content += `\n\n**Classroom use:** ${classroomUse}.`;
				continue;
			}

			const originalProjectLink = item.projectLink;
			if (
				originalProjectLink?.startsWith("https://github.com/") &&
				!/\bJuni\b/i.test(originalProjectLink) &&
				!item.content.includes(originalProjectLink)
			) {
				item.content += `\n\n**Original project files:** [Open the source starter](${originalProjectLink})`;
			}

			if (
				!item.content.includes("**Normal:**") ||
				!item.content.includes("**Hard:**")
			) {
				const challenge = classroomChallenges(courseId, module.title);
				item.content += `\n\n**Classroom build:** Run the completed framework first, then work only inside the labeled Normal and Hard sections. Save a working Normal checkpoint before changing the Hard section.\n\n**Normal:** ${challenge.normal}.\n\n**Hard:** ${challenge.hard}.`;
			}

			const template =
				courseId === "python-level-1-classroom"
					? pythonLevel1ClassroomTemplate(item.title)
					: "classroom-project";
			const sourceUrl = classroomSourceUrl(
				courseId,
				module,
				item,
				originalProjectLink,
				template
			);
			item.projectLink = classroomIdeLink(
				courseId,
				item,
				template,
				sourceUrl?.startsWith("https://github.com/")
					? sourceUrl
					: undefined
			);
		}
	}

	const metadata = course.developmentMetadata;
	if (!metadata) return;

	metadata.sourcePolicy = replaceBeginnerLabel(metadata.sourcePolicy);
	for (const key of [
		"standards",
		"assessmentCadence",
		"toolchain",
		"safetyPolicy",
		"courseBoundaries",
		"capstoneExpectations",
		"recommendedNextWork"
	] as const) {
		metadata[key] = metadata[key].map(replaceBeginnerLabel);
	}
}

function normalizePythonLevel2(course: RawCourse) {
	setItemLinks(course, "Check-In #2", "Check-In #2 Overview", {
		solutionLink: githubTree("Python-Level-2", "PS-Check-in-2/solution")
	});
}

function normalizePythonLevel3(course: RawCourse) {
	for (const checkIn of [1, 2, 3]) {
		setItemLinks(
			course,
			`Check-In #${checkIn}`,
			`Check-In #${checkIn} Overview`,
			{
				projectLink: githubTree(
					"Python-Level-3",
					`AM-Check-In-${checkIn}/starter`
				),
				solutionLink: githubTree(
					"Python-Level-3",
					`AM-Check-In-${checkIn}/solution`
				)
			}
		);
	}
	setItemLinks(
		course,
		"Check-In #2",
		"Check-In #2: Additional Practice Project",
		{
			projectLink: githubTree(
				"Python-Level-3",
				"AM-Check-In-2-Additional-Project/starter"
			),
			solutionLink: githubTree(
				"Python-Level-3",
				"AM-Check-In-2-Additional-Project/solution"
			)
		}
	);
	setItemLinks(
		course,
		"Check-In #3",
		"Check-In #3: Additional Practice Project",
		{
			projectLink: githubTree(
				"Python-Level-3",
				"AM-Check-In-3-Additional-Project/starter"
			),
			solutionLink: githubTree(
				"Python-Level-3",
				"AM-Check-In-3-Additional-Project/solution"
			)
		}
	);
}

function normalizeJavaLevel2(course: RawCourse) {
	const earlyFileSupplementals = new Set([
		"Project 2 File IO and Maps",
		"Reading from a File"
	]);
	const earlyProjectSupplementals = new Set([
		"Supplemental Project Bank Account",
		"Master Project Example Quiz Game"
	]);
	const duplicateCheckIns = new Set(["JM Check in 2: Implementation Lab"]);

	removeSupplementals(
		course,
		"JM1 Instance Variables, Constructors, and Methods",
		item => earlyFileSupplementals.has(item.title)
	);
	removeSupplementals(
		course,
		"JM2 Overloaded Constructors & Comparison Methods",
		item => earlyProjectSupplementals.has(item.title)
	);
	removeSupplementals(
		course,
		"JM3 Static Variables & Methods",
		item => item.title === "Maze Runner"
	);
	removeModules(course, module => duplicateCheckIns.has(module.title));
}

function normalizeJavaLevel3(course: RawCourse) {
	updateCourseLinks(course, url => {
		if (
			url === githubTree("Python-Level-3", "AM13-Priority-Queue") ||
			url === `${githubTree("Python-Level-3", "AM13-Priority-Queue")}/`
		) {
			return githubTree("Java-Level-3", "AJ13-Class-Rank");
		}

		return url;
	});
	setItemLinks(course, "Check-In #3", "Check-In #3 Overview", {
		projectLink: githubTree("Java-Level-3", "AJ-Check-In-3-Starter"),
		solutionLink: githubTree("Java-Level-3", "AJ-Check-In-3")
	});
	setItemLinks(course, "Check-In #3", "Check In #3: Extension Challenge", {
		projectLink: githubTree("Java-Level-3", "AJ-Check-In-3-Starter"),
		solutionLink: githubTree("Java-Level-3", "AJ-Check-In-3")
	});
	setItemLinks(course, "Check-In #4", "Check-In #4 Overview", {
		projectLink: githubTree("Java-Level-3", "AJ-Check-In-4-Starter"),
		solutionLink: githubTree("Java-Level-3", "AJ-Check-In-4")
	});
	setItemLinks(course, "Check-In #4", "Check In #4: Extension Challenge", {
		projectLink: githubTree("Java-Level-3", "AJ-Check-In-4-Starter"),
		solutionLink: githubTree("Java-Level-3", "AJ-Check-In-4")
	});
}

function normalizeAiLevel1(course: RawCourse) {
	const isMarbleGame = (item: RawCourseModuleItem) =>
		item.title.includes("Marble Game");

	removeSupplementals(course, "FAI0 Setup and Tooling", isMarbleGame);
	for (const module of course.modules) {
		module.title = cleanTitleText(module.title);
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = cleanTitleText(item.title);
		}
	}
}

function normalizePythonBridge(course: RawCourse) {
	const bridgeStarter = githubTree(
		"Python-to-Java-and-CPP-Bridge",
		"PTJ6-Python-to-CPP-Console-Port/starter"
	);
	const bridgeSolution = githubTree(
		"Python-to-Java-and-CPP-Bridge",
		"PTJ6-Python-to-CPP-Console-Port/solution"
	);

	updateCourseLinks(course, url => {
		if (url === githubTree("CPP-Level-1", "CPP-Practice"))
			return bridgeStarter;
		return url;
	});
	addSolutionIfMissing(
		course,
		item => item.projectLink === bridgeStarter,
		bridgeSolution
	);
}

function normalizeDataStructuresCpp(course: RawCourse) {
	course.modules = orderedModules(course, [
		"DSCPP0 Setup and Positioning",
		"DSCPP1 Interfaces, Records, and a Task Manager CLI",
		"DSCPP3 STL Containers and State-Based Text Generation",
		"DSCPP4 Recursion and Backtracking in 3D Mazes",
		"DSCPP5 Quicksort and Partitioning",
		"DSCPP6 Templates and Linked Structures",
		"DSCPP7 Binary Search Trees",
		"DSCPP8 AVL Trees and Rebalancing",
		"DSCPP2 Graphs and Shortest Paths",
		"DSCPP9 Benchmarking and Data-Structure Tradeoffs",
		"c algorithm lab 11: Implementation Lab",
		"c algorithm lab 12: Implementation Lab",
		"c algorithm lab 13: Implementation Lab",
		"c algorithm lab 14: Implementation Lab",
		"c algorithm lab 15: Implementation Lab",
		"c algorithm lab 16: Implementation Lab",
		"c algorithm lab 17: Implementation Lab"
	]);
}

function normalizeMachineLearning(course: RawCourse) {
	const misplacedRegressionSupplementals = new Set([
		"Simple Polynomial Regression",
		"Weather Image Classifier"
	]);
	const isMisplacedRegressionSupplemental = (item: RawCourseModuleItem) =>
		misplacedRegressionSupplementals.has(item.title);

	removeSupplementals(
		course,
		"ML0 Setup, Tooling, and Data Workflow",
		item => item.title === "Simple Polynomial Regression"
	);
	removeSupplementals(
		course,
		"ML1 K-Means Clustering",
		isMisplacedRegressionSupplemental
	);
}

function normalizeDesignPatternsJava(course: RawCourse) {
	const mixedJavaLevelModules = new Set([
		"AJ Check In 3: Implementation Lab",
		"AJ Check in 4: Implementation Lab",
		"Flower Class: Implementation Lab",
		"Sum of the First N: Implementation Lab"
	]);

	removeModules(course, module => mixedJavaLevelModules.has(module.title));
	renameModule(
		course,
		"Pattern Implementation Lab 15: Implementation Lab",
		"Pattern Implementation Lab 11: Implementation Lab"
	);
	renameModule(
		course,
		"Pattern Implementation Lab 16: Implementation Lab",
		"Pattern Implementation Lab 12: Implementation Lab"
	);
	renameModule(
		course,
		"Pattern Implementation Lab 17: Implementation Lab",
		"Pattern Implementation Lab 13: Implementation Lab"
	);
}

function normalizePythonicDesignPatterns(course: RawCourse) {
	const isImplementationStudio = (module: RawCourseModule) =>
		module.title.endsWith(": Implementation Lab");

	removeModules(course, isImplementationStudio);
}

function normalizeLowLevelSecurity(course: RawCourse) {
	const isOffensiveStudio = (module: RawCourseModule) =>
		/^Offensive Security Lab \d+: Implementation Lab$/.test(module.title);

	removeModules(course, isOffensiveStudio);
}

function normalizeLowLevelSecurityPart2(course: RawCourse) {
	removeModules(course, module => /rust systems lab/i.test(module.title));
}

function rustFolderForModule(title: string) {
	if (title.startsWith("RSS0"))
		return "RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2";
	if (title.startsWith("RSS10"))
		return "RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2";
	if (title.startsWith("RSS1"))
		return "RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2";
	if (title.startsWith("RSS2"))
		return "RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2";
	if (title.startsWith("RSS3"))
		return "RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2";
	if (title.startsWith("RSS4"))
		return "RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2";
	if (title.startsWith("RSS5"))
		return "RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2";
	if (title.startsWith("RSS6"))
		return "RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2";
	if (title.startsWith("RSS7"))
		return "RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2";
	if (title.startsWith("RSS8"))
		return "RUST-17-rss8-concurrency-and-race-reduction-supplemental-2";
	if (title.startsWith("RSS9"))
		return "RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2";
	return null;
}

function normalizeRustSystemsSecurity(course: RawCourse) {
	const isImplementationStudio = (module: RawCourseModule) =>
		module.title.endsWith(": Implementation Lab");

	removeModules(course, isImplementationStudio);

	updateCourseLinks(course, (url, { module, key }) => {
		if (url.includes("/Rust-Systems-Security/tree/main/")) {
			const folder = rustFolderForModule(module.title);
			if (!folder) return url;
			const leaf = key === "solutionLink" ? "solution" : "starter";
			return githubTree("Low-Level-Security", `${folder}/${leaf}`);
		}

		return url;
	});
}

function usacoCourseFamily(courseId: string) {
	const labels: Record<string, string> = {
		"usaco-bronze": "USACO Bronze",
		"usaco-silver": "USACO Silver",
		"usaco-gold": "USACO Gold"
	};

	return labels[courseId] ?? "USACO";
}

function usacoSupplementalSubject(itemTitle: string) {
	return cleanTitleText(itemTitle)
		.replace(/^Problem:\s*/i, "")
		.replace(/^Extension Challenge:\s*/i, "")
		.replace(/:\s*Extension Challenge$/i, "")
		.replace(
			/\bSupplemental\s+([2-4]):\s*Implementation Lab$/i,
			(_match: string, number: string) => supplementalPurposeLabel(number)
		);
}

function usacoSupplementalProjectKind(itemTitle: string) {
	return /transfer|extension|challenge|supplemental\s+[2-4]/i.test(itemTitle)
		? "extension"
		: "core";
}

function usacoProjectSubject(
	module: RawCourseModule,
	item: RawCourseModuleItem,
	section: "curriculum" | "supplementalProjects"
) {
	if (section === "supplementalProjects")
		return usacoSupplementalSubject(item.title);

	const implementationLabMatch = module.title.match(
		/^(.+?):\s*Implementation Lab$/i
	);
	if (implementationLabMatch) return implementationLabMatch[1].trim();

	return cleanTitleText(item.title)
		.replace(/^Core Project:\s*/i, "")
		.replace(/:\s*Core Project$/i, "")
		.replace(/:\s*Extension Challenge$/i, "")
		.replace(/^Extension Challenge:\s*/i, "");
}

function normalizeUsacoProjectGuidance(course: RawCourse, courseId: string) {
	if (!courseId.startsWith("usaco-")) return;

	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				if (
					!item.projectLink ||
					!/^\*\*Project goal:\*\*/i.test(item.content)
				) {
					continue;
				}

				const subject = usacoProjectSubject(module, item, section);
				item.content = buildProjectGuidance({
					courseFamily: usacoCourseFamily(courseId),
					moduleTitle: subject,
					itemTitle: item.title,
					projectKind: usacoSupplementalProjectKind(item.title),
					hasReference: Boolean(item.solutionLink)
				});
			}
		}
	}
}

function cleanVisibleCourseGrammar(course: RawCourse) {
	const vowelArticleNouns =
		"intermediate|implementation|artifact|edge|empty|input|output|argument|example|activity|analysis|extension|optional|observable|operation|error|invalid|image|environment|experiment|investigation|idea|issue|array|object|interface";
	const consonantArticleNouns =
		"data|small|normal|boundary|working|valid|useful|clear|concrete|specific|single|final|first|second|third|safe|runnable|testable|repeatable|named|short|visible|focused|complete|different|same|simple";
	const evidenceNouns =
		"boundary|behavior|constructor|branch|method|collection operation|diagnostic|data-structure|resource|control-flow change|variable|state transition|view|model|persistence path|normal case|edge case|ordinary behavior|runtime evidence|local lab|page behavior|simulator path|insert\\/search\\/remove path|search|traceable case|sanity check|limitation|example|case|input|path|run|trace|observation";

	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.content = item.content
					.replace(
						new RegExp(`\\b([Aa]) (${vowelArticleNouns})\\b`, "g"),
						(_match: string, article: string, noun: string) =>
							`${article === "A" ? "An" : "an"} ${noun}`
					)
					.replace(
						new RegExp(
							`\\b([Aa])n (${consonantArticleNouns})\\b`,
							"g"
						),
						(_match: string, article: string, noun: string) =>
							`${article === "A" ? "A" : "a"} ${noun}`
					)
					.replace(
						new RegExp(
							`\\b(one|each|every|a|an) the (?:[A-Z]{2}[A-Z0-9+.-]*|Unit|Module)\\b[^.!?\\n]{0,120}? (${evidenceNouns})\\b`,
							"g"
						),
						"$1 $2"
					)
					.replace(
						/\b(first|second|third|another|one) the (?:studio|lab|work) ([a-z])/gi,
						"$1 $2"
					)
					.replace(/\bthe the\b/gi, "the");
			}
		}
	}
}

function removeDuplicateSolutionLinks(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const projectLink = item.projectLink?.trim();
			const solutionLink = item.solutionLink?.trim();
			if (projectLink && solutionLink === projectLink) {
				delete item.solutionLink;
			}
		}
	}
}

const normalizers: Record<string, (course: RawCourse) => void> = {
	"ai-level-1": normalizeAiLevel1,
	"algebra-1a": normalizeAlgebra1A,
	"algebra-1b": normalizeAlgebra1B,
	"ap-computer-science-a": normalizeApComputerScienceA,
	"data-structures-and-algorithms-in-cpp": normalizeDataStructuresCpp,
	"design-patterns-in-java": normalizeDesignPatternsJava,
	"java-level-2": normalizeJavaLevel2,
	"java-level-3": normalizeJavaLevel3,
	"javascript-level-1-javascript-superstar": normalizeJavaScriptLevel1,
	"javascript-level-2-javascript-master": normalizeJavaScriptLevel2,
	"low-level-security": normalizeLowLevelSecurity,
	"low-level-security-part-2": normalizeLowLevelSecurityPart2,
	"machine-learning": normalizeMachineLearning,
	"python-level-1": normalizePythonLevel1,
	"python-level-1-classroom": normalizePythonLevel1,
	"python-level-2": normalizePythonLevel2,
	"python-level-2-classroom": normalizePythonLevel2,
	"python-level-3": normalizePythonLevel3,
	"python-to-java-and-cpp-bridge": normalizePythonBridge,
	"pythonic-design-patterns": normalizePythonicDesignPatterns,
	"rust-systems-security": normalizeRustSystemsSecurity
};

export function normalizeRawCourse(id: string, rawCourse: RawCourse) {
	const course = cloneCourse(rawCourse);
	normalizers[id]?.(course);
	normalizeDisplayTitles(course);
	rewritePlaceholderCourseText(course, id);
	normalizeModuleLessonShape(course);
	applyResearchBackedExpansions(id, course);
	applyCourseImplementationArtifacts(id, course);
	normalizeUsacoProjectGuidance(course, id);
	normalizeImplementationLabLanguage(course);
	normalizeContextualItemTitles(course);
	formatDenseProcedureInstructions(course);
	normalizeCourseTextQuality(course, id);
	neutralizeStudentFacingCourseText(course);
	normalizeGeneratedSupplementalLabels(course);
	distinguishDuplicateGeneratedProjectGuidance(course);
	normalizeLegacyBranding(course);
	contextualizeGenericDisplayTitles(course);
	compactGeneratedDisplayTitles(course);
	normalizeStaticMediaUrls(course);
	appendPendingStaticMediaNotices(course);
	formatVisibleCourseMarkdown(course);
	cleanVisibleCourseGrammar(course);
	removeDuplicateSolutionLinks(course);
	if (CLASSROOM_BASE_COURSE_IDS[id]) {
		adaptClassroomCourse(course, id);
		applyCourseLearningPaths(course);
	}
	return course;
}
