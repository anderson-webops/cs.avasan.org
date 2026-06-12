import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { applyCourseImplementationArtifacts } from "./course-implementation-artifacts";
import { applyResearchBackedExpansions } from "./research-expansions";

const INSTRUCTION_MATERIAL_BASE = "https://github.com/instruction-material";

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
		return `${moduleTitle}: Diagnostic Checkpoint`;
	}

	const supplementalMatch = itemTitle.match(/^(.+?) Supplemental ([23])$/i);
	if (!supplementalMatch) return itemTitle;

	const baseTitle = cleanDisplayTitle(supplementalMatch[1]);
	const number = supplementalMatch[2];

	if (
		sameTitle(baseTitle, moduleTitle) ||
		genericSupplementalNeedsCourseContext(moduleTitle)
	) {
		return `${withCourseContext(courseTitle, moduleTitle)} Supplemental ${number}`;
	}

	return `${moduleTitle}: Supplemental ${number}`;
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
	/project|capstone|challenge|lab|practice|drill|notebook|audit|reflection|build|create|implement|exercise/i;

function isProjectLikeItem(item: RawCourseModuleItem) {
	return (
		projectLikeTitlePattern.test(item.title) ||
		Boolean(item.projectLink || item.solutionLink)
	);
}

function compactWhitespace(text: string) {
	return text.replace(/\s+/g, " ").trim();
}

function preservesBlockStructure(text: string) {
	return /(?:^|\n)\s*(?:[-*]|\d+\.)\s+\S/.test(text);
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

function neutralizeLessonPointText(text: string) {
	return compactWhitespace(text)
		.replace(/^Set expectations for\b/i, "This section establishes")
		.replace(/^Teach students to\b/i, "This section covers how to")
		.replace(/^Show students\b/i, "This section shows")
		.replace(/^Introduce\b/i, "This section introduces")
		.replace(/^Teach\b/i, "This section covers")
		.replace(/^Cover\b/i, "This section covers")
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

function lessonArcContent(items: RawCourseModuleItem[]) {
	const points = items.map((item, index) => {
		const title = stripLessonTitlePrefix(item.title);
		const content = neutralizeLessonPointText(item.content);
		return `${index + 1}. **${title}**\n   ${content}`;
	});

	return ["Core topics in this module:", "", ...points].join("\n");
}

function briefConceptAddendum(
	module: RawCourseModule,
	item: RawCourseModuleItem
) {
	const seed = `${module.title}|${item.title}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return [
		`${item.title} connects the key vocabulary to ${module.title} through a compact example and one transfer check.`,
		`${item.title} works as a short reference for ${module.title}: define the terms, trace one example, and check the idea in a nearby case.`,
		`${item.title} should make the ${module.title} idea concrete with vocabulary, a small example, and one way to verify understanding.`,
		`${item.title} links ${module.title} to the module project by naming the core terms, showing one example, and checking one changed condition.`
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

function groupConceptLessons(items: RawCourseModuleItem[]) {
	if (items.length <= 4) {
		return [
			{
				title: "Core Concepts",
				content: lessonArcContent(items)
			}
		];
	}

	const midpoint = Math.ceil(items.length / 2);
	return [
		{
			title: "Core Concepts",
			content: lessonArcContent(items.slice(0, midpoint))
		},
		{
			title: "Application Check",
			content: lessonArcContent(items.slice(midpoint))
		}
	];
}

function normalizeModuleLessonShape(course: RawCourse) {
	for (const module of course.modules) {
		const conceptItems = module.curriculum.filter(
			item => !isProjectLikeItem(item)
		);

		if (conceptItems.length === 0) continue;

		if (conceptItems.length <= 2) {
			module.curriculum = module.curriculum.map(item =>
				isProjectLikeItem(item)
					? item
					: enrichBriefConceptLesson(module, item)
			);
			continue;
		}

		if (conceptItems.some(hasAttachedResource)) {
			module.curriculum = module.curriculum.map(item =>
				isProjectLikeItem(item)
					? item
					: enrichBriefConceptLesson(module, item)
			);
			continue;
		}

		const groupedConcepts = groupConceptLessons(conceptItems);
		const nextCurriculum: RawCourseModuleItem[] = [];
		let insertedConceptGroup = false;

		for (const item of module.curriculum) {
			if (isProjectLikeItem(item)) {
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
	/\*\*(?:Project goal|Teaching flow|Concept path|Learning sequence|Diagnostic guidance|Readiness check|Misconception check|Common pitfalls|Exit check|Mastery check|Remote investigation|Science explanation|Studio focus|AP connection):?\*\*/i;

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

function capitalizeMatchedFirstLetter(_match: string, first: string) {
	return capitalizeFirstLetter(first);
}

function keepMatchedFirstLetter(_match: string, first: string) {
	return first;
}

function beforeStartingMatchedFirstLetter(_match: string, first: string) {
	return `Before starting, ${first}`;
}

function toMatchedFirstLetter(_match: string, first: string) {
	return `to ${first}`;
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
		const previous = start > 0 ? text[start - 1] : "";

		if (/[\d.]/.test(previous)) continue;

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

function formatSupportLabels(text: string) {
	return text.replace(
		/([^\n])\s+(\*\*(?:Project goal|Required outcome|Completion checks|Extension|Concept path|Common pitfalls|Mastery check|Readiness check|Evidence of proficiency|If this is difficult|Remote investigation|Science explanation|Output):\*\*)/g,
		"$1\n\n$2"
	);
}

function formatVisibleMarkdownStructure(text: string) {
	return formatSupportLabels(formatInlineNumberedLists(text));
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

function neutralizeLessonDirectiveText(text: string) {
	return text
		.replace(
			/\bRepeat the core ideas from ([^.]+) on a smaller problem to build speed, independence, and cleaner reasoning\./g,
			(_match, topic) =>
				`Practice ${stripTrailingSentencePunctuation(topic)} on a focused smaller problem to build speed, independence, and cleaner reasoning.`
		)
		.replace(
			/\bCreate an original variation inspired by ([^.]+)\. Keep the scope small, but require one meaningful design or reasoning choice\./g,
			(_match, topic) =>
				`Design a small original variation of ${stripTrailingSentencePunctuation(topic)} with one meaningful design or reasoning choice.`
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Teach students to\b/g,
			"$1This section covers how to"
		)
		.replace(/(^|\n\s*|[.!?]\s+|:\s+)Teach\b/g, "$1This section covers")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Introduce\b/g,
			"$1This section introduces"
		)
		.replace(/(^|\n\s*|:\s+)Cover\b/g, "$1This section covers")
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Set expectations for\b/g,
			"$1This section establishes"
		)
		.replace(
			/(^|\n\s*|[.!?]\s+|:\s+)Set expectations\b/g,
			"$1Clear expectations are established"
		)
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
				lessonOpening("This lesson covers", description, topics)
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
		.replace(/\bshould start with\b/g, "should begin with")
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
			"Common mistakes include"
		)
		.replace(
			/\bwatch for likely mistakes such as\b/g,
			"common mistakes include"
		)
		.replace(/\bWatch for\b/g, "Common pitfalls include")
		.replace(/\bwatch for\b/g, "common pitfalls include")
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
			/\s*\bPractice target: ([^.]+)\./g,
			(_match, practice) =>
				`\n\n**Practice target:** ${capitalizeFirstLetter(stripTrailingSentencePunctuation(practice))}.`
		)
		.replace(
			/\s*\bVisible pattern: ([^.]+)\./g,
			(_match, outcome) =>
				`\n\n**Visible pattern:** ${capitalizeFirstLetter(stripTrailingSentencePunctuation(outcome))}.`
		)
		.replace(
			/\s*\bKey idea: ([^.]+)\./g,
			(_match, outcome) =>
				`\n\n**Key idea:** ${capitalizeFirstLetter(stripTrailingSentencePunctuation(outcome))}.`
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
		neutralizeLessonDirectiveText(text)
			.replace(/\bCore Concepts and Teaching Flow\b/g, "Core Concepts")
			.replace(/\*\*Teaching flow:\*\*/gi, "**Concept path:**")
			.replace(/\*\*Learning sequence:\*\*/gi, "**Concept path:**")
			.replace(
				/(\*\*Concept path:\*\*\s+)Teach\b/g,
				"$1This section covers"
			)
			.replace(
				/(\*\*Concept path:\*\*\s+)Introduce\b/g,
				"$1This section introduces"
			)
			.replace(
				/(\*\*Concept path:\*\*\s+)Cover\b/g,
				"$1This section covers"
			)
			.replace(
				/(\*\*Concept path:\*\*\s+)Set expectations for\b/g,
				"$1This section establishes"
			)
			.replace(
				/(\*\*Concept path:\*\*\s+)Set expectations\b/g,
				"$1Clear expectations are established"
			)
			.replace(/\*\*Diagnostic guidance:\*\*/gi, "**Readiness check:**")
			.replace(/\*\*Misconception check:\*\*/gi, "**Common pitfalls:**")
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
			.replace(/\bTreat this module as\b/gi, "This module functions as")
			.replace(
				/\bTreat this as the anchor for\b/gi,
				"This is the anchor for"
			)
			.replace(/\bTreat this as\b/gi, "Use this as")
			.replace(/\binstructor-provided\b/gi, "provided")
			.replace(/\binstructor-approved\b/gi, "approved")
			.replace(/\binstructor-authored\b/gi, "authored")
			.replace(/\binstructor references\b/gi, "internal references")
			.replace(/\bteacher-provided\b/gi, "provided")
			.replace(/\bteacher requirement\b/gi, "course requirement")
			.replace(/\bstudent-facing course\b/gi, "visible course")
			.replace(/\bstudent-facing\b/gi, "visible")
			.replace(/\bStudents\b/g, "Learners")
			.replace(/\bstudents\b/g, "learners")
			.replace(/\bA student\b/g, "A learner")
			.replace(/\ba student\b/g, "a learner")
			.replace(
				/\bthe tutor should know whether\b/gi,
				"the priority indicates whether"
			)
			.replace(
				/\bthe tutor should be able to\b/gi,
				"the course should make it possible to"
			)
			.replace(
				/\bThe tutor should be able to\b/g,
				"The course should make it possible to"
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
			.replace(/\bHave students ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(
				/\bAsk the student to ([a-z])/g,
				capitalizeMatchedFirstLetter
			)
			.replace(/\bAsk students to ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\bAsk them to ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\bAsk them whether\b/g, "Evaluate whether")
			.replace(/\bAsk them where\b/g, "Identify where")
			.replace(/\bAsk them what\b/g, "Describe what")
			.replace(/\bAsk them why\b/g, "Explain why")
			.replace(/\bAsk what\b/g, "Analyze what")
			.replace(/\bAsk why\b/g, "Analyze why")
			.replace(/\bAsk how\b/g, "Analyze how")
			.replace(/\bConsider why\b/g, "Consider why")
			.replace(/\bAsk the student\b/g, "Consider")
			.replace(/\bIf the struggles with\b/g, "If this term is difficult,")
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
			.replace(
				/\bBroadcast messages between\b/g,
				"Use broadcasts between"
			)
			.replace(/\bShow how to\b/gi, "Practice how to")
			.replace(/\bShow how\b/gi, "Notice how")
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
			.replace(/\bask the student to ([a-z])/g, keepMatchedFirstLetter)
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
			.replace(/\bConsider what\b/g, "Consider what")
			.replace(/\bask students what\b/g, "consider what")
			.replace(/\bthen ask them to\b/gi, "then add")
			.replace(/\bthen ask them\b/gi, "then include")
			.replace(/\bAsk students whether\b/g, "Evaluate whether")
			.replace(/\bask students whether\b/g, "evaluate whether")
			.replace(/\bAsk students to ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\bask students to ([a-z])/g, keepMatchedFirstLetter)
			.replace(/\bhave students ([a-z])/g, keepMatchedFirstLetter)
			.replace(/\bLet the student ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\blet the student ([a-z])/g, keepMatchedFirstLetter)
			.replace(/\bThe student should be able to\b/g, "Be able to")
			.replace(/\bBe able to\b/g, "Be able to")
			.replace(/\bthe student should be able to\b/g, "be able to")
			.replace(/\bBe able to\b/g, "be able to")
			.replace(/\bThe student should explain\b/g, "Explain")
			.replace(/\bExplain\b/g, "Explain")
			.replace(/\bthe student should explain\b/g, "explain")
			.replace(/\bExplain\b/g, "Explain")
			.replace(/\bThe student should identify\b/g, "Identify")
			.replace(/\bIdentify\b/g, "Identify")
			.replace(/\bthe student should identify\b/g, "identify")
			.replace(/\bIdentify\b/g, "Identify")
			.replace(/\bThe student should\b/g, "The goal is to")
			.replace(/\bStudents should\b/g, "The goal is to")
			.replace(/\bthe student should\b/g, "the goal is to")
			.replace(/\bstudents should\b/g, "the goal is to")
			.replace(/\bwhen the student needs one more\b/gi, "for one more")
			.replace(/\bwhen the student needs another\b/gi, "for another")
			.replace(/\bwhen the student needs a cleaner\b/gi, "for a cleaner")
			.replace(/\bwhen the student needs a\b/gi, "for a")
			.replace(/\bwhen the student needs more\b/gi, "for more")
			.replace(/\bwhen the student needs to\b/gi, "to")
			.replace(/\bwhen the student still\b/gi, "when more practice still")
			.replace(/\bwhen the student is ready for\b/gi, "when ready for")
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
			.replace(/\bthe student's future self\b/gi, "future maintenance")
			.replace(/\bthe student's map\b/gi, "the course map")
			.replace(/\bthe student's goals\b/gi, "the learning goals")
			.replace(
				/\bonce the student builds the habit\b/gi,
				"once this debugging habit is built"
			)
			.replace(/\bUse the Student Class build\b/g, "Use Student Class")
			.replace(/\bthe student-class build\b/gi, "the Student Class build")
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
			.replace(/\bThe student solves\b/g, "A complete response solves")
			.replace(/\bthe student solves\b/g, "a complete response solves")
			.replace(/\bThe student keeps\b/g, "The error log keeps")
			.replace(/\bthe student keeps\b/g, "the error log keeps")
			.replace(/\bThe student includes\b/g, "The final work includes")
			.replace(/\bthe student includes\b/g, "the final work includes")
			.replace(/\bstudent suggests\b/g, "response suggests")
			.replace(/\bstudent answers\b/g, "response answers")
			.replace(/\bbefore the student enters\b/gi, "before entering")
			.replace(/\bstudent enters\b/g, "the entry uses")
			.replace(/\bThe learner should\b/g, "The goal is to")
			.replace(/\bLearners should\b/g, "The goal is to")
			.replace(/\bthe learner should\b/g, "the goal is to")
			.replace(/\blearners should\b/g, "the goal is to")
			.replace(/\bThe learner can ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\bthe learner can ([a-z])/g, keepMatchedFirstLetter)
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
			.replace(/\bThe student can ([a-z])/g, capitalizeMatchedFirstLetter)
			.replace(/\bthe student can ([a-z])/g, keepMatchedFirstLetter)
	);

	return normalizeSectionActionAgreement(neutralized);
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
	return /applied studio|studio|lab \d+/i.test(
		`${context.module.title} ${context.item.title}`
	);
}

function isBriefContent(content: string) {
	return wordCount(content) < 65 || compactWhitespace(content).length < 460;
}

function needsContentSupport(context: CourseTextContext) {
	const content = context.item.content;
	if (!content.trim()) return true;
	if (structuredSupportPattern.test(content)) return false;

	return (
		placeholderContentPattern.test(content) ||
		isBriefContent(content) ||
		/Core Concepts|Application Check/.test(context.item.title) ||
		isAppliedStudioContext(context) ||
		(isProjectLikeItem(context.item) && wordCount(content) < 95) ||
		(isCheckInContext(context) && wordCount(content) < 120)
	);
}

function subjectFocus(context: CourseTextContext) {
	const source = contextText(context);

	if (/ap computer science|apcs/.test(source)) {
		return "AP CSA Java reasoning: tracing code, explaining object state, writing method-level logic, and testing edge cases";
	}
	if (/python level 1|grs/.test(source)) {
		return "beginner Python fluency: variables, input, conditionals, loops, functions, and readable console output";
	}
	if (/python level 2|ps\d/.test(source)) {
		return "Python program design: control flow, data structures, user input, and careful testing of console behavior";
	}
	if (/python level 3|advanced python|am\d/.test(source)) {
		return "advanced Python decomposition, algorithmic reasoning, file/data handling, and clear testing habits";
	}
	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
		return "Scratch game design: sprites, event blocks, broadcasts, variables, costumes or backdrops, loops, and playable feedback";
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return "PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback";
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return "Swift app development: project structure, SwiftUI views, state flow, signing, simulator/device testing, and release readiness";
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return "Linux systems practice: shell commands, filesystems, users and permissions, services, logs, automation, and repeatable troubleshooting evidence";
	}
	if (isScienceContext(context)) {
		return "scientific explanation: observable phenomena, models, data, vocabulary, and claim-evidence-reasoning";
	}
	if (
		/javascript|jss\d|jsm\d|web|html|css|full-stack|api|database/.test(
			source
		)
	) {
		return "web development workflow: user-facing behavior, browser checks, API/data flow, accessibility, and deployment readiness";
	}
	if (isJavaContext(context)) {
		return variantPrompt(context, [
			subject =>
				`${subject} through object-oriented Java design: classes, method contracts, object state, inheritance, interfaces, records, and tests`,
			subject =>
				`${subject} through Java type design: objects, fields, methods, collection choices, public APIs, and compile-run feedback`,
			subject =>
				`${subject} through Java program structure: constructors, object state, method behavior, access boundaries, and testable cases`,
			subject =>
				`${subject} through Java reasoning: values versus references, class responsibilities, interfaces or records when useful, and visible verification`
		]);
	}
	if (/c\+\+|cpp|c level|data structures.*cpp|algorithm lab/.test(source)) {
		return "C++ engineering: types, memory ownership, containers, algorithms, command-line behavior, and repeatable tests";
	}
	if (/c systems|systems build|assembly/.test(source)) {
		return "systems programming: machine representation, memory layout, build tooling, low-level debugging, and safe constraints";
	}
	if (/usaco|competitive/.test(source)) {
		return "competitive-programming discipline: input parsing, sample verification, edge cases, and complexity reasoning";
	}
	if (/security|offensive|low-level security|network security/.test(source)) {
		return "safe security analysis: local-only test fixtures, threat modeling, evidence collection, and defensive remediation";
	}
	if (isNetworkSystemsSource(source)) {
		return "network systems practice: addressing, routing, ports, DNS, packet evidence, service exposure, and diagnostic reasoning";
	}
	if (
		/data science|data analysis|machine learning|ai search|ai level|model/.test(
			source
		)
	) {
		return "data and model reasoning: dataset assumptions, measured output, interpretation, limitations, and responsible use";
	}
	if (/unity|game development|game-mechanics/.test(source)) {
		return "game development: scene setup, state changes, player feedback, playtesting, and a clear completion loop";
	}
	if (/design pattern|refactoring|pattern implementation/.test(source)) {
		return "software design tradeoffs: naming, responsibilities, coupling, refactoring safety, and behavior-preserving tests";
	}
	if (/algebra|geometry|calculus|math/.test(source)) {
		return "mathematical reasoning: worked examples, notation, graph or table interpretation, and explanation of each step";
	}

	return "the module's core concept, a concrete worked example, and a testable artifact";
}

function isMathContext(context: CourseTextContext) {
	return /algebra|geometry|calculus|math/.test(contextText(context));
}

function isNetworkSystemsSource(source: string) {
	return /\b(?:network systems|dns|routing|packets?|tcpdump|ipv6|nat)\b/.test(
		source
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

function isWebContext(context: CourseTextContext) {
	return (
		context.courseId === "web-development-foundations" ||
		/javascript|jss\d|jsm\d|web|html|css|api|database|full-stack/.test(
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
	return /scratch|sprite|broadcast|clone|backdrop|green flag|pygames?|zrect|projectile|enemy ai|game loop|unity|game development|game-mechanics/.test(
		contextText(context)
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
		return "Assuming a dataset is complete or neutral, confusing correlation with explanation, trusting one metric without a baseline, or omitting limitations and responsible-use boundaries.";
	}
	if (isApcsContext(context)) {
		return "Rushing past Java's exact syntax, confusing primitive values with object references, skipping trace tables, or testing only the example from the prompt.";
	}
	if (isCompetitiveProgrammingContext(context)) {
		return "Matching the sample without proving the general case, missing boundary sizes, using an algorithm that is too slow for the constraints, or overlooking duplicate and tie cases.";
	}
	if (isSwiftAppContext(context)) {
		return "Unclear state ownership, treating previews as full tests, overlooking empty or error states, skipping accessibility and layout checks, or confusing Xcode configuration issues with app behavior.";
	}
	if (isSecurityContext(context)) {
		return "Blurring the authorized scope, changing a system before recording the baseline, trusting command output without interpretation, or skipping rollback, mitigation, and verification evidence.";
	}
	if (isSystemsContext(context)) {
		return "Changing a toolchain or system state before recording the baseline, using commands whose effects are unclear, trusting output without interpretation, or skipping rollback and reproducibility evidence.";
	}
	if (isGameContext(context)) {
		return "Unclear start or reset state, event order bugs, collision or score changes that are hard to trace, and feedback that does not show the player what changed.";
	}
	if (isWebContext(context)) {
		return "Building only the happy path, hiding loading or error states, ignoring keyboard and screen-size behavior, or letting UI state drift away from the data source.";
	}
	if (/python/.test(source)) {
		return "Mixing input, calculation, and output in one hard-to-test block; mutating a list while looping; missing a return value; or only testing the happy path.";
	}
	if (isJavaContext(context)) {
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
		return "Losing track of ownership or lifetime, mixing indices with values, ignoring compiler warnings, or testing only the case that appears in the prompt.";
	}
	if (/design pattern|refactoring|pattern implementation/.test(source)) {
		return "Adding abstraction before there is a real variation, changing behavior during refactoring, hiding responsibilities behind vague names, or skipping before-and-after tests.";
	}

	return "Confusing the example with the general rule, skipping a boundary condition, leaving assumptions unstated, or accepting a result without evidence.";
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

function proficiencyEvidence(context: CourseTextContext) {
	if (isScienceContext(context)) {
		return "Name the model, cite the evidence, explain the vocabulary, and describe how the conclusion would change under one new condition.";
	}
	if (isMathContext(context)) {
		return `For ${context.module.title}, explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be reasonable.`;
	}
	if (isDataAiMlContext(context)) {
		return "Name the question, inspect the evidence, compare against a baseline or sanity check, and state one limitation of the result.";
	}
	if (isApcsContext(context)) {
		return "Trace the Java state, compile or run the target method, test a normal case and an edge case, and explain the AP-style reasoning in precise vocabulary.";
	}
	if (isCompetitiveProgrammingContext(context)) {
		return "Pass the samples, explain the invariant or algorithm idea, test a smallest and largest relevant case, and justify the time and memory complexity.";
	}
	if (isSwiftAppContext(context)) {
		return "Explain the state flow, show the normal interaction, verify one empty or error case, and separate app behavior from Xcode or simulator configuration.";
	}
	if (isSecurityContext(context)) {
		return "State the scope, show the command or configuration evidence, explain the impact, and verify the rollback, mitigation, or final state.";
	}
	if (isSystemsContext(context)) {
		return "State the starting environment, show the command or configuration evidence, explain the result, and verify rollback or reproducibility.";
	}
	if (isGameContext(context)) {
		return "Explain the main state change, show the normal play path, test one edge case, and describe how the player can tell the result worked.";
	}
	if (isWebContext(context)) {
		return "Explain the user flow, show the data or state transition, verify loading/success/error behavior, and check the layout at a narrow and wide width.";
	}
	if (/python/.test(contextText(context))) {
		return "Explain the data flow, run a normal case and an edge case, and point to the function or loop where the main transformation happens.";
	}
	if (isJavaContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Explain the object roles in ${subject}, show the method call or test that proves the behavior, and identify one state or type decision that matters.`,
			subject =>
				`For ${subject}, name the responsible class or record, demonstrate the public behavior, and explain one edge case tied to object state or type choice.`,
			subject =>
				`Use ${subject} to show how the constructor, method, field, interface, or collection choice affects the result, then verify it with a small run or test.`,
			subject =>
				`Summarize ${subject} by naming the API boundary, the data it protects or exposes, and the evidence that the behavior works.`
		]);
	}
	if (/c\+\+|cpp/.test(contextText(context))) {
		return "Explain the data representation, show the compile/run or test evidence, and identify one ownership, lifetime, or container choice that matters.";
	}

	return "Explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be correct.";
}

function remediationPrompt(context: CourseTextContext) {
	if (isScienceContext(context))
		return "Name the specific misconception, revise one evidence sentence, and revisit the same vocabulary in a second phenomenon.";
	if (isMathContext(context))
		return "Name the exact step that broke down, complete one focused remediation problem, and revisit the same skill before moving to a more complex project.";
	if (isDataAiMlContext(context))
		return "Name the data or interpretation issue, run one smaller sanity check, and revise the limitation statement before extending the project.";
	if (isSwiftAppContext(context))
		return "Name the state, layout, navigation, or build issue, reproduce it in the smallest screen, and verify the simulator or preview path before adding features.";
	if (isSecurityContext(context))
		return "Name the missing evidence or unsafe assumption, repeat the smallest safe diagnostic, and document the rollback or mitigation before continuing.";
	if (isSystemsContext(context))
		return "Name the missing evidence or environment assumption, repeat the smallest safe diagnostic, and document rollback or reproducibility before continuing.";
	if (isGameContext(context))
		return "Name the event, state, or feedback issue, test it in the smallest possible scene, and verify the reset or replay path before adding features.";

	return variantPrompt(context, [
		subject =>
			`Record the specific misconception in ${subject}, complete one focused remediation problem, and revisit the same skill before moving to a more complex project.`,
		subject =>
			`For ${subject}, identify the missing vocabulary, tracing step, syntax habit, design choice, or test case, then retry a smaller version.`,
		subject =>
			`Use ${subject} to name the blocker, solve one narrower practice case, and return to the original prompt with the corrected idea.`,
		subject =>
			`If ${subject} is difficult, isolate the smallest failing step, correct it with one focused example, and record what changed.`
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
				`Change one unit, scale, or model limit in ${subject} and predict how the claim should change.`,
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
			`Change one constraint or case in ${subject} while preserving the same core concept.`,
		subject =>
			`Represent ${subject} a second way and explain what stays equivalent.`,
		subject =>
			`Add one edge case to ${subject} and identify which requirement it tests.`,
		subject =>
			`Change one success condition in ${subject} and compare it with the original version.`
	]);
}

function projectExpectations(context: CourseTextContext) {
	const source = contextText(context);
	const subject = extensionSubject(context);

	if (
		/scratch|sprite|broadcast|clone|backdrop|green flag|pen extension/.test(
			source
		)
	) {
		return variantLines(context, [
			subject => [
				`- Define what each ${subject} sprite controls, senses, changes, or broadcasts.`,
				`- Test ${subject} from the green-flag start through the main controls or events and the win, loss, score, or reset condition.`,
				`- Keep ${subject} explainable by naming the event blocks, variables, and state changes that drive the behavior.`
			],
			subject => [
				`- Map ${subject} sprites to events, variables, costumes, sounds, broadcasts, or clone behavior before adding polish.`,
				`- Test ${subject} startup, one normal play path, one reset path, and one scoring or boundary case.`,
				`- Explain which ${subject} block sequence controls the visible result.`
			],
			subject => [
				`- Identify the ${subject} player action, sprite response, state variable, and feedback shown on the stage.`,
				`- Test ${subject} with intended input, repeated input, and a case where nothing should happen.`,
				`- Keep ${subject} logic traceable from event block to state change to visible stage behavior.`
			]
		]);
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return [
			`- Define the ${subject} game state, actor responsibilities, input events, collision rules, and frame-by-frame update loop.`,
			`- Test ${subject} startup, player controls, collision/no-collision cases, scoring or health changes, and reset or end-state behavior.`,
			`- Keep ${subject} drawing, updating, event handling, and game-state changes separated enough to debug one layer at a time.`
		];
	}
	if (isUnityContext(context)) {
		return [
			`- Define the ${subject} scene, player action, object responsibilities, state changes, win/loss or completion condition, and visible feedback.`,
			`- Playtest ${subject} startup, normal controls, one collision or interaction edge case, and the reset or replay path.`,
			`- Keep ${subject} scripts, prefabs, scene setup, and inspector configuration documented enough that the behavior can be reproduced.`
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return [
			`- Define the ${subject} screen, state owner, data flow, build target, and simulator or device behavior before implementation.`,
			`- Test ${subject} with a fresh launch, one normal interaction, one empty/error state when relevant, and one layout or accessibility check.`,
			`- Record the ${subject} Xcode, signing, preview, simulator, or TestFlight evidence that proves the app state is understood.`
		];
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the ${subject} state, data, features, actions, model, or search space before implementation.`,
				`- Test ${subject} with a tiny traceable case, a normal case, and one boundary or failure case that challenges the algorithm or interpretation.`,
				`- Record the ${subject} evidence used to judge the result: trace, metric, sanity check, baseline, visualization, or limitation.`
			],
			subject => [
				`- State the ${subject} input representation, expected behavior, and evaluation signal before building.`,
				`- Test ${subject} with a hand-checkable case, a representative case, and one case where the result should be uncertain or limited.`,
				`- Explain which ${subject} trace, score, comparison, or visualization supports the conclusion.`
			],
			subject => [
				`- Identify the ${subject} assumptions about data, state, actions, search, rules, or scoring before implementation.`,
				`- Compare ${subject} against a baseline, simple trace, or known-answer example before accepting a larger result.`,
				`- Record one ${subject} limitation that would change the interpretation or next experiment.`
			]
		]);
	}
	if (isCompetitiveProgrammingContext(context)) {
		return [
			`- State the ${subject} input format, output format, constraints, and algorithm idea before coding.`,
			`- Test the ${subject} sample exactly, then add a smallest case, a boundary case, and a duplicate, tie, or adversarial case when relevant.`,
			`- Record the ${subject} time and memory complexity and why those bounds fit the problem constraints.`
		];
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return [
			`- State the ${subject} command, file path, service, permission, process, or log being inspected before making changes.`,
			`- Verify the ${subject} normal path and one failure or rollback path using command output, logs, status checks, or file metadata.`,
			`- Keep a short ${subject} operations note with the exact commands used and the evidence that the system reached the intended state.`
		];
	}
	if (isNetworkSystemsSource(source)) {
		return [
			`- Define the ${subject} hosts, addresses, ports, routes, protocols, and trust boundaries before running diagnostics.`,
			`- Test ${subject} local behavior, remote or cross-host behavior, and one failure case using command output or packet/service evidence.`,
			`- Record the ${subject} observed symptom, diagnostic command, interpretation, and configuration or topology fact it proves.`
		];
	}
	if (isLowLevelSystemsContext(context)) {
		return [
			`- Define the ${subject} build command, source/header boundary, runtime input, memory assumption, or observable machine behavior before implementation.`,
			`- Verify ${subject} normal behavior and one failure path with compiler output, sanitizer output, return codes, register or memory traces, logs, or command-line output.`,
			`- Record the exact ${subject} command and evidence so the systems behavior can be reproduced from a clean checkout or shell.`
		];
	}
	if (
		/\binput\/output\b/.test(source) &&
		!/\b(?:file|files|csv|parser|streams?|pipelines?)\b/.test(source)
	) {
		return variantLines(context, [
			subject => [
				`- Define which ${subject} values are typed by the user, which values are stored, and which values are printed.`,
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
		return [
			`- Define the ${subject} build command, source/header boundary, runtime input, memory assumption, or observable system behavior before implementation.`,
			`- Verify ${subject} normal behavior and one failure path with compiler output, sanitizer output, return codes, logs, or command-line output.`,
			`- Record the exact ${subject} command and evidence so the systems behavior can be reproduced from a clean checkout or shell.`
		];
	}
	if (/\b(?:multi-file|source files?|headers?)\b/.test(source)) {
		return [
			"- Define which declarations belong in headers, which definitions belong in source files, and which file contains the runnable entry point.",
			"- Build from a clean compile command and verify that include paths, class boundaries, and linker behavior are understood.",
			"- Keep a short note naming one organization choice that made the program easier to extend or debug."
		];
	}
	if (isWebContext(context)) {
		return [
			`- Define the visible ${subject} user flow and data flow before implementation.`,
			`- Verify ${subject} in the browser at desktop and narrow widths.`,
			`- Check ${subject} loading, empty, success, and error states instead of only the happy path.`
		];
	}
	if (/security|offensive|threat|network/.test(source)) {
		return [
			`- Work on ${subject} only against local fixtures, intentionally vulnerable examples, or owned test data.`,
			`- Write the ${subject} threat model or failure mode before running the lab.`,
			`- Finish ${subject} with evidence, impact, and a defensive mitigation or hardening step.`
		];
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
				`- Record which ${subject} recursive or iterative branch is taken during one traced operation.`
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
		return [
			`- Show the ${subject} array or list before and after the algorithm runs.`,
			`- Test ${subject} with already-sorted, reverse-sorted, duplicate-value, and small-size inputs.`,
			`- Explain which ${subject} comparisons or swaps dominate the runtime.`
		];
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
				`- Explain which ${subject} loop variable controls rows, columns, or element positions.`
			],
			subject => [
				`- Show the ${subject} data before and after the operation so changes are visible.`,
				`- Test ${subject} at index 0, the final valid index, and one value that should not be accessed.`,
				`- Explain how the ${subject} traversal avoids skipping elements or reading beyond the structure.`
			],
			subject => [
				`- Choose a compact ${subject} sample that can be traced by hand.`,
				`- Test ${subject} with duplicate values, a boundary position, and one case where no change should happen.`,
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
				`- Explain which ${subject} operation controls correctness: insertion, lookup, update, removal, or ordering.`
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
				`- Test ${subject} with lowercase, uppercase, symbols, and a message that should return unchanged.`,
				`- Verify ${subject} by decoding an encoded message and comparing it with the starting text.`
			]
		]);
	}
	if (/\b(?:file|files|parser|csv|json|io|i\/o)\b/.test(source)) {
		return [
			`- Identify the expected ${subject} file format and how malformed or missing data will be handled.`,
			`- Test ${subject} with at least one normal file and one awkward file with an empty line or incomplete record.`,
			`- Keep ${subject} parsing, validation, and output formatting separated enough to debug each part.`
		];
	}
	if (/pointer|address|dynamic memory|raw array|memory/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Draw or annotate the ${subject} relationship between values, addresses, and ownership before coding.`,
				`- Test ${subject} allocation, access, resizing or cleanup behavior, and an empty or one-element case.`,
				`- Explain which ${subject} object owns each resource and when that resource is released.`
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
		return [
			`- Identify the ${subject} Java concept being practiced, the relevant variables or object state, and the expected output or method result.`,
			`- Compile and run ${subject}, then test a normal AP-style case plus one edge case involving a boundary value, empty collection, null-risk, or branch change when relevant.`,
			`- Include a short ${subject} trace, state table, or explanation of why the selected Java construct behaves that way.`
		];
	}
	if (/python/.test(source)) {
		return variantLines(context, [
			subject => [
				`- Name the input values, helper functions or loops, data structures, and printed output for ${subject} before coding.`,
				`- Test ${subject} with one normal case, one empty or smallest case, and one awkward input such as extra spaces, casing, duplicates, or invalid data when relevant.`,
				`- Keep ${subject} explainable by separating input handling, core logic, and output formatting.`
			],
			subject => [
				`- For ${subject}, identify the input surface, transformation step, helper boundary, collection or file shape, and expected output.`,
				`- Run ${subject} with a typical case, a smallest or empty case, and one awkward input that can be traced by hand.`,
				`- Keep ${subject} input parsing, core logic, and final formatting separate enough to debug one layer at a time.`
			],
			subject => [
				`- Turn ${subject} into a small Python data-flow plan: input, stored values, loop or function, output, and evidence.`,
				`- Check ${subject} with a normal path, a boundary path, and one surprising input such as punctuation, casing, duplicates, or missing data.`,
				`- Keep the final ${subject} explanation tied to the function, loop, list, dictionary, file, or algorithm that drives the result.`
			],
			subject => [
				`- Before coding ${subject}, write the expected input, intermediate state, helper function role, and final printed or saved result.`,
				`- Use a tiny ${subject} traceable case first, then add one ordinary case and one awkward or invalid case.`,
				`- Keep the ${subject} implementation readable enough that the data flow can be followed without rereading every line.`
			]
		]);
	}
	if (isJavaContext(context)) {
		return variantLines(context, [
			subject => [
				`- Define the classes, object state, method inputs, return values, and expected console or test output for ${subject}.`,
				`- Compile and run ${subject} after meaningful class or method changes, then test one normal case and one edge case.`,
				`- Keep a short ${subject} note naming the class responsibility, verified method, and important object-state change.`
			],
			subject => [
				`- Map ${subject} to Java types, fields, methods, parameters, return values, and visible output before coding.`,
				`- Use short compile/run cycles in ${subject} so syntax, type, and object-state errors stay easy to isolate.`,
				`- Record the ${subject} normal case, edge case, and class or method responsibility being verified.`
			],
			subject => [
				`- For ${subject}, name the owning class, stored state, public method behavior, and expected output or assertion.`,
				`- Add one ${subject} constructor, branch, method, or collection operation at a time, compiling between meaningful changes.`,
				`- Keep a ${subject} note on the object-state change, equality check, access boundary, or dispatch rule that matters most.`
			],
			subject => [
				`- Turn ${subject} into a concrete Java contract: inputs, object state, return values, side effects, and evidence.`,
				`- Build ${subject} in small runnable slices and check output, tests, or traces before adding the next behavior.`,
				`- Include one ${subject} normal path, one awkward path, and one note about the relevant type or API boundary.`
			]
		]);
	}
	if (/c\+\+|cpp/.test(source)) {
		return [
			`- Define the ${subject} data representation, ownership or lifetime assumptions, compile command, and expected output.`,
			`- Build ${subject} with warnings enabled when possible and test one normal case, one boundary case, and one malformed or awkward input.`,
			`- Record the ${subject} container, pointer/reference, or memory decision that most affects correctness.`
		];
	}
	if (isMathContext(context)) {
		return variantLines(context, [
			subject => [
				`- State the ${subject} givens, target quantity, representation, and rule or theorem before solving.`,
				`- Work a typical ${subject} example, then check a boundary, sign, unit, graph, or table case that could change the interpretation.`,
				`- Keep each ${subject} algebraic or representational step justified so the final answer can be checked for reasonableness.`
			],
			subject => [
				`- Identify the ${subject} known values, unknown value, and representation before choosing a method.`,
				`- Test ${subject} with one ordinary case and one case involving sign, intercept, domain, unit, or graph behavior.`,
				`- Explain how the ${subject} answer can be checked without simply repeating the same calculation.`
			],
			subject => [
				`- Translate ${subject} into an equation, graph, table, diagram, or verbal model before solving.`,
				`- Check ${subject} with a substitution, estimate, graph feature, boundary value, or unit/context test.`,
				`- Record the ${subject} reason each transformation is valid so the result is auditable.`
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
		return [
			`- The ${subject} solution passes the sample input/output exactly.`,
			`- Test ${subject} with a smallest-case input, a largest-reasonable input, and a tie or duplicate case when relevant.`,
			`- State the ${subject} time complexity and why it fits the expected constraints.`
		];
	}
	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
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
				`- The ${subject} note names the Scratch state variable or event chain most responsible for correctness.`
			]
		]);
	}
	if (isUnityContext(context)) {
		return [
			`- The ${subject} scene starts from a predictable state and the main interaction is visible during play mode.`,
			`- ${subject} controls, collisions or interactions, scoring/progress, and reset or completion behavior are checked.`,
			`- The final ${subject} note names the script, prefab, or scene setting that most directly controls the behavior.`
		];
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return [
			`- ${subject} starts from a predictable game state and can be restarted or ended intentionally.`,
			`- ${subject} actor updates, input events, collisions, score/health changes, and draw order are verified with at least one normal and boundary case.`,
			`- The final ${subject} explanation names the game loop, the most important state variable, and one bug or edge case found during playtesting.`
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return [
			`- ${subject} builds and launches on the intended simulator or device target.`,
			`- ${subject} state changes, navigation, layout, loading/error behavior, signing, or release workflow evidence is captured as appropriate.`,
			`- The final ${subject} note separates code behavior from Xcode/project configuration behavior.`
		];
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
		return [
			`- ${subject} builds from the documented command or toolchain setting.`,
			`- ${subject} compiler output, sanitizer output, register or memory evidence, return codes, logs, or command-line output confirms the intended behavior.`,
			`- The final ${subject} note includes one failure mode, debugging command, or reproducibility detail that would help future troubleshooting.`
		];
	}
	if (isNetworkSystemsSource(source)) {
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
				"- The final answer includes a claim, evidence, and reasoning connection."
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
				`- The final ${subject} note names the condition that would make the answer invalid or incomplete.`
			]
		]);
	}
	if (isDataAiMlContext(context)) {
		return variantLines(context, [
			subject => [
				`- The ${subject} result is checked against a small trace, baseline, metric, visualization, or sanity check.`,
				`- ${subject} includes a normal case and a boundary or failure case that is tested or explained.`,
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
		return [
			`- The ${subject} Java code compiles and the target behavior is visible in output, tests, or a completed trace.`,
			`- ${subject} checks a normal case and an edge case for the relevant branch, loop, method, class, array, or list behavior.`,
			`- The ${subject} explanation uses precise Java vocabulary instead of only describing what the program appears to print.`
		];
	}
	if (isWebContext(context)) {
		return [
			`- The ${subject} feature works from a fresh page load without relying on hidden state.`,
			`- ${subject} empty, loading, success, and failure states are visible or intentionally handled.`,
			`- The ${subject} page remains readable and usable on mobile and desktop widths.`
		];
	}
	if (/python/.test(source)) {
		return variantLines(context, [
			subject => [
				`- ${subject} can be rerun cleanly with predictable output.`,
				`- ${subject} has normal, empty or smallest, and awkward inputs tested or justified.`,
				`- The ${subject} explanation identifies the main function, loop, or data structure that drives the result.`
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
				`- The final ${subject} note names the function, loop, data structure, or algorithm decision that mattered.`
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
				`- ${subject} checks a normal case, edge case, and object-state or method-dispatch case.`,
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
			]
		]);
	}
	if (/c\+\+|cpp/.test(source)) {
		return [
			`- ${subject} builds from the documented command or IDE target.`,
			`- ${subject} checks normal, boundary, and invalid or awkward inputs with visible output or tests.`,
			`- The ${subject} explanation names the relevant container, pointer/reference, ownership, or algorithm choice.`
		];
	}
	if (/security|offensive|low-level security|network security/.test(source)) {
		return [
			`- The ${subject} lab uses only approved local or owned targets.`,
			`- ${subject} findings are written as evidence plus impact, not as vague observations.`,
			`- The final ${subject} work includes a safe remediation, detection, or hardening step.`
		];
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
	if (itemTitle.includes(moduleTitle) || moduleTitle.includes(itemTitle)) {
		return itemTitle;
	}

	return `${itemTitle} (${moduleTitle})`;
}

function variantPrompt(
	context: CourseTextContext,
	templates: Array<(subject: string) => string>
) {
	const seed = `${context.courseId}|${context.module.title}|${context.item.title}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return templates[hash % templates.length](extensionSubject(context));
}

function variantLines(
	context: CourseTextContext,
	templates: Array<(subject: string) => string[]>
) {
	const seed = `${context.courseId}|${context.module.title}|${context.item.title}`;
	let hash = 0;

	for (const character of seed) {
		hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
	}

	return templates[hash % templates.length](extensionSubject(context));
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
				`Extend ${subject} with input validation for one unexpected or blank response.`,
			subject =>
				`Add one extra mode to ${subject} that reuses the same variables, loops, or helper functions.`,
			subject =>
				`Add a retry or recovery path to ${subject} so an awkward input does not stop the program.`,
			subject =>
				`Create one alternate output path for ${subject} and test it with a small hand-traced input.`
		]);
	}
	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
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
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
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
				`Add a rollback or recovery step to ${subject} and document when it should be used.`,
			subject =>
				`Add a logging, permission, service, or automation check to ${subject} that can be rerun from a clean shell.`,
			subject =>
				`Add one failure-mode check to ${subject} and record the command that distinguishes it from the healthy state.`
		]);
	}
	if (isNetworkSystemsSource(source)) {
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
	if (isJavaContext(context)) {
		return variantPrompt(context, [
			subject =>
				`Extend ${subject} with one additional method and a test or console trace that proves its contract.`,
			subject =>
				`Add a subclass, interface, or record variation to ${subject} without changing the existing public behavior.`,
			subject =>
				`Add one collection, object-state, or method-overload case to ${subject} and document the expected output.`,
			subject =>
				`Add a small negative or edge-case test to ${subject} that protects the class boundary already built.`
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
				`Add a build, sanitizer, debugger, or logging check to ${subject} that confirms the low-level behavior.`
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
			`Add one verification example to ${subject} that would catch a different mistake than the original case.`,
		subject =>
			`Add one small feature to ${subject} and explain which concept it reuses rather than only decorating the output.`
	]);
}

function projectSupport(context: CourseTextContext) {
	const subject = extensionSubject(context);
	return [
		`**Project goal:** Build a working result for **${subject}** that shows ${subjectFocus(context)} through behavior, output, evidence, or explanation.`,
		`**Required outcome:**\n${projectExpectations(context).join("\n")}`,
		`**Completion checks:**\n${completionChecks(context).join("\n")}`,
		`**Extension:** ${extensionPrompt(context)}`
	].join("\n\n");
}

function lessonSupport(context: CourseTextContext) {
	return [
		`**Concept path:** ${context.module.title} introduces ${subjectFocus(context)} through key terms, a worked example, and a transfer check tied to the module project.`,
		`**Common pitfalls:** ${commonPitfalls(context)}`,
		`**Mastery check:** ${proficiencyEvidence(context)}`
	].join("\n\n");
}

function diagnosticSupport(context: CourseTextContext) {
	const readiness = variantPrompt(context, [
		subject =>
			`This is a formative check of ${subjectFocus(context)}, not a pass/fail quiz. Attempt ${subject} independently first, then use the result to identify whether the issue is ${diagnosticCategories(context)}.`,
		subject =>
			`Use ${subject} as a readiness check for ${subjectFocus(context)}. First try ${subject} without hints, then classify any gap as ${diagnosticCategories(context)}.`,
		subject =>
			`${subject} checks whether the core idea is ready for transfer. Start ${subject} with an independent attempt, then use the evidence to decide whether the next step is vocabulary, tracing, syntax, design, or testing support.`,
		subject =>
			`Treat ${subject} as a low-stakes checkpoint: solve what is possible first, then identify the smallest missing piece before moving to harder work.`
	]);

	return [
		`**Readiness check:** ${readiness}`,
		`**Evidence of proficiency:** ${proficiencyEvidence(context)}`,
		`**If this is difficult:** ${remediationPrompt(context)}`,
		`**Extension:** ${diagnosticExtensionPrompt(context)}`
	].join("\n\n");
}

function scienceSupport(context: CourseTextContext) {
	const remoteInvestigation = variantPrompt(context, [
		subject =>
			`${subject} uses shared-screen materials, notes, paper, pencil, and provided images, graphs, data, or simulations. ${subject} does not require beakers, kits, or household materials; any physical demonstration can be replaced with a diagram or data table.`,
		subject =>
			`${subject} is designed for a Zoom-safe workflow using provided visuals, readings, simulations, or datasets. ${subject} treats physical supplies as optional context only; the core evidence should be visible from notes, diagrams, tables, or screen-shared resources.`,
		subject =>
			`${subject} can be completed with a notebook, pencil, and shared digital resources. If ${subject} mentions a physical example, treat it as optional context and keep the required investigation tied to data, diagrams, models, or simulations.`,
		subject =>
			`${subject} should rely on accessible remote evidence: images, short videos, graphs, public datasets, simulations, or structured discussion notes. Any hands-on observation must be safe, simple, and replaceable.`
	]);
	const output = variantPrompt(context, [
		subject =>
			`Complete a claim-evidence-reasoning response for ${subject}, plus a labeled diagram or data table and one prediction about a changed condition.`,
		subject =>
			`Finish ${subject} with a labeled model or table, a short CER response, and one comparison between observation and inference.`,
		subject =>
			`Record the evidence for ${subject}, annotate the model or data display, and write one claim that explains what the evidence supports.`,
		subject =>
			`For ${subject}, produce a concise explanation that includes target vocabulary, evidence from the resource, and one limit or next-test idea.`
	]);
	const scienceExplanation = variantPrompt(context, [
		subject =>
			`Anchor ${subject} in ${subjectFocus(context)}. For ${subject}, record observations first, then build or annotate a model, and only then write the explanation.`,
		subject =>
			`Use ${subject} to connect the phenomenon, evidence source, model, and vocabulary before writing the final claim.`,
		subject =>
			`For ${subject}, separate what is directly observed from what the model explains, then use the evidence to support the claim.`,
		subject =>
			`Ground ${subject} in the provided data, visual, simulation, or reading, and make the model limitation visible when the explanation is written.`
	]);

	return [
		`**Remote investigation:** ${remoteInvestigation}`,
		`**Science explanation:** ${scienceExplanation}`,
		`**Output:** ${output}`,
		`**Completion checks:**\n${completionChecks(context).join("\n")}`
	].join("\n\n");
}

function scienceEvidenceCheckpoint(context: CourseTextContext) {
	return variantPrompt(context, [
		subject =>
			`**CER checkpoint:** End ${subject} with a claim, evidence, and reasoning response. The ${subject} claim answers the question, the evidence comes from the provided image, graph, dataset, reading, or simulation, and the reasoning uses the target vocabulary to explain why that evidence supports the claim.`,
		subject =>
			`**CER checkpoint:** For ${subject}, write one claim, cite the specific evidence source, and explain the connection with the target vocabulary rather than only naming the topic.`,
		subject =>
			`**CER checkpoint:** Finish ${subject} by separating the claim, the evidence, and the reasoning. The ${subject} evidence should point to the resource used, and the reasoning should explain why it supports the claim.`,
		subject =>
			`**CER checkpoint:** Connect ${subject} to a clear claim, a resource-based evidence statement, and reasoning that names the scientific idea or model being used.`,
		subject =>
			`**CER checkpoint:** Use ${subject} to name the phenomenon, quote or describe the evidence source, and explain the scientific model that links the evidence to the claim.`,
		subject =>
			`**CER checkpoint:** A complete ${subject} response states the claim, identifies the observation or data behind it, and uses vocabulary from the module to justify the reasoning.`
	]);
}

function studioArtifact(context: CourseTextContext) {
	const source = contextText(context);

	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
		return "a playable Scratch project with clear event flow, sprite state, and feedback";
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
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
	if (isNetworkSystemsSource(source)) {
		return "a network systems checkpoint with topology, commands, packet or service evidence, and interpretation";
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
	if (/physics|chemistry|science/.test(source)) {
		return "a remote-safe investigation writeup using provided data, a diagram, or a simulation";
	}
	if (/security|offensive|network/.test(source)) {
		return "a safe local security lab report with threat model, evidence, and mitigation";
	}
	if (/web|full-stack/.test(source)) {
		return "a browser-visible feature with defined UI behavior, data flow, and error handling";
	}
	if (/data science|machine learning|ai/.test(source)) {
		return "a notebook or script that turns a defined dataset or state space into measured, interpreted output";
	}

	return "a working artifact with explicit requirements, test cases, and a short explanation";
}

function studioSupport(context: CourseTextContext) {
	const studioFocus = variantPrompt(context, [
		subject =>
			`Define the problem, prerequisite concepts, and success criteria for ${subject}. The ${subject} artifact should identify what is being created, which constraints matter, and which evidence proves the work is correct.`,
		subject =>
			`Use ${subject} to name the artifact, core requirement, constraint, and verification evidence before adding polish.`,
		subject =>
			`For ${subject}, separate the minimum working version from extensions so the required behavior can be tested first.`,
		subject =>
			`Frame ${subject} around one observable result, the constraints that shape it, and the evidence that proves it works.`
	]);
	const reviewStep = variantPrompt(context, [
		subject =>
			/^review\b/i.test(subject)
				? `Use ${subject} to compare the finished work against the original goal and record at least one improvement or bug fix.`
				: `Review ${subject} against the original goal and record at least one improvement or bug fix.`,
		subject =>
			`Compare ${subject} with the stated success criteria and note one revision that improves correctness, clarity, or robustness.`,
		subject =>
			`After ${subject} works, record one mismatch, limitation, or design choice that would guide a later revision.`,
		subject =>
			`Finish ${subject} by naming one test result, one improvement made, and one remaining constraint.`
	]);

	return [
		`**Applied studio:** **${context.item.title}** produces ${studioArtifact(context)} connected to ${subjectFocus(context)}.`,
		`**Studio focus:** ${studioFocus}`,
		`**Build sequence:**\n${projectExpectations(context).join("\n")}\n- ${reviewStep}`,
		`**Completion checks:**\n${completionChecks(context).join("\n")}`,
		`**Extension:** ${extensionPrompt(context)}`
	].join("\n\n");
}

function qualitySupportFor(context: CourseTextContext) {
	if (isCheckInContext(context)) return diagnosticSupport(context);
	if (isScienceContext(context)) return scienceSupport(context);
	if (isAppliedStudioContext(context)) return studioSupport(context);
	if (isProjectLikeItem(context.item)) return projectSupport(context);
	return lessonSupport(context);
}

function rewritePlaceholderCourseText(course: RawCourse, courseId: string) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };

				if (
					placeholderContentPattern.test(item.content) ||
					(isAppliedStudioContext(context) &&
						wordCount(item.content) < 90)
				) {
					item.content = studioSupport(context);
				}
			}
		}
	}
}

function normalizeCourseTextQuality(course: RawCourse, courseId: string) {
	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };

				if (!needsContentSupport(context)) continue;

				const currentContent = supportBaseContent(item.content);
				const support = qualitySupportFor(context);
				item.content = currentContent
					? `${currentContent}\n\n${support}`
					: support;
			}
		}
	}

	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				const context = { courseId, course, module, item, section };
				if (
					isScienceContext(context) &&
					!scienceEvidencePattern.test(item.content)
				) {
					item.content = `${supportBaseContent(item.content)}\n\n${scienceEvidenceCheckpoint(context)}`;
				}
			}
		}
	}
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
			.replace(titlePattern, ": Applied Lab");

		for (const section of ["curriculum", "supplementalProjects"] as const) {
			for (const item of module[section]) {
				item.title = item.title
					.replace(
						patternImplementationTitlePattern,
						"Pattern Applied Lab"
					)
					.replace(titlePattern, ": Applied Lab")
					.replace(implementationLabelPattern, "Applied Lab");
				item.content = item.content
					.replace(
						patternImplementationTitlePattern,
						"Pattern Applied Lab"
					)
					.replace(titlePattern, ": Applied Lab")
					.replace(implementationLabelPattern, "Applied Lab")
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
						"Use this supplemental task as adjacent practice. The linked repository gives a starting point; any reference link shows one complete solution path. Focus on the same core idea while handling a different input shape, constraint, or edge case."
					)
					.replace(
						genericSupplementalPattern,
						"Use this supplemental task as adjacent practice. The linked repository gives a starting point; any reference link shows one complete solution path. Focus on the same core idea while handling a different input shape, constraint, or edge case."
					);
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
		solutionLink: githubTree("Python-Level-1", "GRS-Check-in-Two-Updated")
	});
	setItemLinks(
		course,
		"Check-In #2",
		"Check-In #2: Additional Practice Project",
		{
			projectLink: githubTree(
				"Python-Level-1",
				"Check-in-Two-Practice-Project"
			),
			solutionLink: githubTree(
				"Python-Level-1",
				"Check-in-Two-Additional-Practice-ProjectUpdated"
			)
		}
	);
	setItemLinks(course, "Check-In #3", "Check-In #3 Overview", {
		solutionLink: githubTree("Python-Level-1", "GRS-Check-in-Three-Updated")
	});
}

function normalizePythonLevel2(course: RawCourse) {
	setItemLinks(course, "Check-In #2", "Check-In #2 Overview", {
		solutionLink: githubTree("Python-Level-2", "PS-Check-in-2")
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
	"python-level-2": normalizePythonLevel2,
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
	normalizeImplementationLabLanguage(course);
	normalizeCourseTextQuality(course, id);
	neutralizeStudentFacingCourseText(course);
	formatVisibleCourseMarkdown(course);
	return course;
}
