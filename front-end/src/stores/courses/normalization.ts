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

function normalizeDisplayTitles(course: RawCourse) {
	for (const module of course.modules) {
		module.title = cleanDisplayTitle(module.title);
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			item.title = cleanDisplayTitle(item.title);
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

function enrichBriefConceptLesson(item: RawCourseModuleItem) {
	if (compactWhitespace(item.content).length >= 220) return item;

	return {
		...item,
		content: `${compactWhitespace(item.content)} The core vocabulary, one concrete example, one prediction or explanation, and one small transfer task connect this idea to the module project.`
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
				isProjectLikeItem(item) ? item : enrichBriefConceptLesson(item)
			);
			continue;
		}

		if (conceptItems.some(hasAttachedResource)) {
			module.curriculum = module.curriculum.map(item =>
				isProjectLikeItem(item) ? item : enrichBriefConceptLesson(item)
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
			"Vocabulary, one concrete example, a next-step prediction, and a project connection form the core sequence for this module."
		)
		.replace(
			/\bStart with ([^.]+)\./g,
			(_match, topic) =>
				`The starting point is ${stripTrailingSentencePunctuation(topic).replace(/\band get\b/g, "and getting")}.`
		)
		.replace(
			/\bstart with ([^.]+)\./g,
			(_match, topic) =>
				`the starting point is ${stripTrailingSentencePunctuation(topic).replace(/\band get\b/g, "and getting")}.`
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

function neutralizeStudentFacingText(text: string) {
	return neutralizeLessonDirectiveText(text)
		.replace(/\bCore Concepts and Teaching Flow\b/g, "Core Concepts")
		.replace(/\*\*Teaching flow:\*\*/gi, "**Concept path:**")
		.replace(/\*\*Learning sequence:\*\*/gi, "**Concept path:**")
		.replace(/(\*\*Concept path:\*\*\s+)Teach\b/g, "$1This section covers")
		.replace(
			/(\*\*Concept path:\*\*\s+)Introduce\b/g,
			"$1This section introduces"
		)
		.replace(/(\*\*Concept path:\*\*\s+)Cover\b/g, "$1This section covers")
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
		.replace(/\bTreat this as the anchor for\b/gi, "This is the anchor for")
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
		.replace(/\bHave the student ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bHave students ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bAsk the student to ([a-z])/g, capitalizeMatchedFirstLetter)
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
		.replace(/\byou can have them visualize\b/g, "it may help to visualize")
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
		.replace(/\bShow how to\b/gi, "Practice how to")
		.replace(/\bShow how\b/gi, "Notice how")
		.replace(/\bShow where\b/g, "Identify where")
		.replace(/\bShow the difference between\b/g, "Compare")
		.replace(/\bShow the an example of\b/g, "Review an example of")
		.replace(/\bGuide learners to\b/g, "This section guides the process of")
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
		.replace(/\bonce the student is comfortable\b/gi, "once comfortable")
		.replace(
			/\bwhether the student is ready to move on\b/gi,
			"whether moving on is appropriate"
		)
		.replace(
			/\bdeepen the student's understanding\b/gi,
			"deepen understanding"
		)
		.replace(/\bthe student's current strengths\b/gi, "current strengths")
		.replace(/\bthe student’s current strengths\b/gi, "current strengths")
		.replace(/\bthe student's real shell\b/gi, "the real shell")
		.replace(/\bthe student's host machine\b/gi, "the real host machine")
		.replace(/\bthe student’s host machine\b/gi, "the real host machine")
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
		.replace(
			/\bpositioning the student for\b/gi,
			"positioning the learner for"
		)
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
		.replace(/\bstudent enters\b/g, "learner enters")
		.replace(/\bThe learner should\b/g, "The goal is to")
		.replace(/\bLearners should\b/g, "The goal is to")
		.replace(/\bthe learner should\b/g, "the goal is to")
		.replace(/\blearners should\b/g, "the goal is to")
		.replace(/\bThe learner can ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bthe learner can ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bthe learner's\b/g, "their")
		.replace(/\bthe learner\b/g, "the learner")
		.replace(/\blearner suggests\b/g, "the response suggests")
		.replace(/\blearner answers\b/g, "the response answers")
		.replace(/\bThe student has tested or justified\b/g, "Test or justify")
		.replace(/\bthe student has tested or justified\b/g, "test or justify")
		.replace(/\bThe student tests\b/g, "Test")
		.replace(/\bthe student tests\b/g, "test")
		.replace(/\bThe student can ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bthe student can ([a-z])/g, keepMatchedFirstLetter);
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

function contextText(context: CourseTextContext) {
	return `${context.courseId} ${context.course.name} ${context.module.title} ${context.item.title}`.toLowerCase();
}

function isCheckInContext(context: CourseTextContext) {
	return /\bcheck[- ]?in\b|practice exam|assessment/i.test(
		`${context.module.title} ${context.item.title}`
	);
}

function isScienceContext(context: CourseTextContext) {
	const source = contextText(context);

	if (/computer science|data science/i.test(source)) return false;

	return /elementary[- ]science|middle[- ]school[- ]integrated[- ]science|middle[- ]school[- ]science|physics|chemistry|biology|earth|ecosystem|motion|matter|weather|energy/i.test(
		source
	);
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
	if (/java/.test(source)) {
		return "object-oriented Java design: classes, method contracts, object state, inheritance, interfaces, records, and tests";
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
	if (
		/network systems|dns|ports|routing|packet|tcpdump|ipv6|nat/.test(source)
	) {
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

function isSwiftAppContext(context: CourseTextContext) {
	return context.courseId === "intro-to-swift-app-development";
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

function commonPitfalls(context: CourseTextContext) {
	const source = contextText(context);

	if (isScienceContext(context)) {
		return "Common mistakes include treating observations as conclusions, using vocabulary loosely, ignoring units or scale, or claiming that a model proves more than it actually shows.";
	}
	if (isMathContext(context)) {
		return "Common mistakes include dropping negative signs or units, skipping the reason for an algebraic step, reading graph or table labels too quickly, or giving an answer without a context check.";
	}
	if (isDataAiMlContext(context)) {
		return "Common mistakes include assuming a dataset is complete or neutral, confusing correlation with explanation, trusting one metric without a baseline, or omitting limitations and responsible-use boundaries.";
	}
	if (isSwiftAppContext(context)) {
		return "Common mistakes include unclear state ownership, treating previews as full tests, overlooking empty or error states, skipping accessibility and layout checks, or confusing Xcode configuration issues with app behavior.";
	}
	if (isSecurityContext(context)) {
		return "Common mistakes include blurring the authorized scope, changing a system before recording the baseline, trusting command output without interpretation, or skipping rollback, mitigation, and verification evidence.";
	}
	if (isSystemsContext(context)) {
		return "Common mistakes include changing a toolchain or system state before recording the baseline, using commands whose effects are unclear, trusting output without interpretation, or skipping rollback and reproducibility evidence.";
	}
	if (isGameContext(context)) {
		return "Common mistakes include unclear start or reset state, event order bugs, collision or score changes that are hard to trace, and feedback that does not show the player what changed.";
	}
	if (/design pattern|refactoring|pattern implementation/.test(source)) {
		return "Common mistakes include adding abstraction before there is a real variation, changing behavior during refactoring, hiding responsibilities behind vague names, or skipping before-and-after tests.";
	}

	return "Common mistakes include mixing up values, references, and state; using the wrong loop condition or boundary; skipping edge cases; or leaving the result untested.";
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
		return "Explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be reasonable.";
	}
	if (isDataAiMlContext(context)) {
		return "Name the question, inspect the evidence, compare against a baseline or sanity check, and state one limitation of the result.";
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

	return "Record the specific misconception, complete one focused remediation problem, and revisit the same skill before moving to a more complex project.";
}

function projectExpectations(context: CourseTextContext) {
	const source = contextText(context);

	if (
		/scratch|sprite|broadcast|clone|backdrop|green flag|pen extension/.test(
			source
		)
	) {
		return [
			"- Define what each sprite controls, senses, changes, or broadcasts.",
			"- Test the green-flag start, the main controls or events, and the win, loss, score, or reset condition.",
			"- Keep the project explainable by naming the event blocks, variables, and state changes that drive the behavior."
		];
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return [
			"- Define the game state, actor responsibilities, input events, collision rules, and frame-by-frame update loop.",
			"- Test startup, player controls, collision/no-collision cases, scoring or health changes, and reset or end-state behavior.",
			"- Keep drawing, updating, event handling, and game-state changes separated enough to debug one layer at a time."
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return [
			"- Define the screen, state owner, data flow, build target, and simulator or device behavior before implementation.",
			"- Test a fresh launch, one normal interaction, one empty/error state when relevant, and one layout or accessibility check.",
			"- Record the Xcode, signing, preview, simulator, or TestFlight evidence that proves the app state is understood."
		];
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return [
			"- State the command, file path, service, permission, process, or log being inspected before making changes.",
			"- Verify the normal path and one failure or rollback path using command output, logs, status checks, or file metadata.",
			"- Keep a short operations note with the exact commands used and the evidence that the system reached the intended state."
		];
	}
	if (
		/network systems|dns|ports|routing|packet|tcpdump|ipv6|nat/.test(source)
	) {
		return [
			"- Define the hosts, addresses, ports, routes, protocols, and trust boundaries before running diagnostics.",
			"- Test local behavior, remote or cross-host behavior, and one failure case using command output or packet/service evidence.",
			"- Record the observed symptom, the diagnostic command, the interpretation, and the configuration or topology fact it proves."
		];
	}
	if (
		/\binput\/output\b/.test(source) &&
		!/\b(?:file|files|csv|parser|streams?|pipelines?)\b/.test(source)
	) {
		return [
			"- Define which values are typed by the user, which values are stored, and which values are printed.",
			"- Test typical input, awkward input such as extra spaces or decimals when relevant, and output labels that make the result unambiguous.",
			"- Keep input collection, calculation, and printed output separated enough to debug each step."
		];
	}
	if (/c systems|systems build|assembly/.test(source)) {
		return [
			"- Define the build command, source/header boundary, runtime input, memory assumption, or observable system behavior before implementation.",
			"- Verify normal behavior and one failure path with compiler output, sanitizer output, return codes, logs, or command-line output.",
			"- Record the exact command and evidence so the systems behavior can be reproduced from a clean checkout or shell."
		];
	}
	if (/\b(?:multi-file|source files?|headers?)\b/.test(source)) {
		return [
			"- Define which declarations belong in headers, which definitions belong in source files, and which file contains the runnable entry point.",
			"- Build from a clean compile command and verify that include paths, class boundaries, and linker behavior are understood.",
			"- Keep a short note naming one organization choice that made the program easier to extend or debug."
		];
	}
	if (/web|html|css|api|database|full-stack/.test(source)) {
		return [
			"- Define the visible user flow and the data flow before implementation.",
			"- Verify the feature in the browser at desktop and narrow widths.",
			"- Check loading, empty, success, and error states instead of only the happy path."
		];
	}
	if (/security|offensive|threat|network/.test(source)) {
		return [
			"- Work only against local fixtures, intentionally vulnerable examples, or owned test data.",
			"- Write the threat model or failure mode before running the lab.",
			"- Finish with evidence, impact, and a defensive mitigation or hardening step."
		];
	}
	if (/binary search/.test(source)) {
		return [
			"- State the sorted-data precondition before coding.",
			"- Implement the search so found, missing, first-half, and second-half targets are handled correctly.",
			"- Trace at least one search by recording the low, high, and middle indices at each step."
		];
	}
	if (/linear search|sequential search/.test(source)) {
		return [
			"- Implement the search result in a way that clearly reports found versus not found.",
			"- Test the first item, last item, middle item, and a missing target.",
			"- If the data is sorted, explain when the search can stop early and why that is safe."
		];
	}
	if (/sort|selection|insertion|merge|quick/.test(source)) {
		return [
			"- Show the array or list before and after the algorithm runs.",
			"- Test already-sorted, reverse-sorted, duplicate-value, and small-size inputs.",
			"- Explain which comparisons or swaps dominate the runtime."
		];
	}
	if (/array|matrix|grid|two-dimensional|2d/.test(source)) {
		return [
			"- Use a small visible example so row and column positions can be traced.",
			"- Test first row, last row, first column, last column, and an interior position.",
			"- Explain how the loop bounds prevent out-of-range indexing."
		];
	}
	if (/dictionary|map|hash|set/.test(source)) {
		return [
			"- Demonstrate adding, reading, updating, and checking for a missing key or value.",
			"- Print or inspect the data structure after each important change.",
			"- Explain why the chosen structure is better than a plain list for this task."
		];
	}
	if (/calendar machine|date|time/.test(source)) {
		return [
			"- Define the conversion assumptions clearly before coding.",
			"- Print the result in labeled units so the output is not ambiguous.",
			"- Test zero days, a small number of days, and a value large enough to use every unit."
		];
	}
	if (/cipher|encode|decode|secret|message/.test(source)) {
		return [
			"- Preserve or intentionally transform spaces, punctuation, and letter case according to the spec.",
			"- Test wraparound at the beginning and end of the alphabet.",
			"- Include one encode/decode round trip that returns the original message."
		];
	}
	if (/\b(?:file|files|parser|csv|json|io|i\/o)\b/.test(source)) {
		return [
			"- Identify the expected file format and how malformed or missing data will be handled.",
			"- Test at least one normal file and one awkward file with an empty line or incomplete record.",
			"- Keep parsing, validation, and output formatting separated enough to debug each part."
		];
	}
	if (/pointer|address|dynamic memory|raw array|memory/.test(source)) {
		return [
			"- Draw or annotate the relationship between values, addresses, and ownership before coding.",
			"- Test allocation, access, resizing or cleanup behavior, and an empty or one-element case.",
			"- Explain which object owns each resource and when that resource is released."
		];
	}
	if (
		/physics|chemistry|science|biology|earth|ecosystem|weather|motion/.test(
			source
		)
	) {
		return [
			"- Use a provided image, graph, data table, short video, or simulation rather than required physical supplies.",
			"- Record observations before explaining them.",
			"- Finish with a claim, evidence, and reasoning response using the target vocabulary."
		];
	}

	return [
		"- Restate the prompt as a short checklist before coding or building.",
		"- Implement the base behavior first, then test a normal case and an edge case.",
		"- Keep the final result explainable: the final note should describe the main design choice and one bug that was fixed."
	];
}

function completionChecks(context: CourseTextContext) {
	const source = contextText(context);

	if (/usaco|competitive/.test(source)) {
		return [
			"- The solution passes the sample input/output exactly.",
			"- Test a smallest-case input, a largest-reasonable input, and a tie or duplicate case when relevant.",
			"- State the time complexity and why it fits the expected constraints."
		];
	}
	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
		return [
			"- The green flag starts the project from a predictable state.",
			"- Controls, events, broadcasts, variables, and sprite interactions behave as intended.",
			"- A short explanation names the main state change and one edge case tested during play."
		];
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return [
			"- The game starts from a predictable state and can be restarted or ended intentionally.",
			"- Actor updates, input events, collisions, score/health changes, and draw order are verified with at least one normal and boundary case.",
			"- The final explanation names the game loop, the most important state variable, and one bug or edge case found during playtesting."
		];
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return [
			"- The app builds and launches on the intended simulator or device target.",
			"- State changes, navigation, layout, loading/error behavior, signing, or release workflow evidence is captured as appropriate.",
			"- The final note separates code behavior from Xcode/project configuration behavior."
		];
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return [
			"- Commands are repeatable from a fresh shell or documented starting state.",
			"- File, permission, process, service, timer, network, or log evidence confirms the intended system state.",
			"- The final note includes one failure mode, rollback step, or diagnostic command that would help future troubleshooting."
		];
	}
	if (
		/network systems|dns|ports|routing|packet|tcpdump|ipv6|nat/.test(source)
	) {
		return [
			"- The topology, host roles, addresses, ports, protocols, or firewall boundaries are named explicitly.",
			"- Diagnostic evidence shows both expected behavior and at least one failure or blocked-path condition.",
			"- The final explanation connects the observed packet, port, DNS, route, or service result to the network model."
		];
	}
	if (/science|physics|chemistry|biology|earth|ecosystem/.test(source)) {
		return [
			"- The explanation names the phenomenon, the model or data source, and the target vocabulary.",
			"- Separate observation from inference.",
			"- The final answer includes a claim, evidence, and reasoning connection."
		];
	}
	if (/web|html|css|api|database|full-stack/.test(source)) {
		return [
			"- The feature works from a fresh page load without relying on hidden state.",
			"- Empty, loading, success, and failure states are visible or intentionally handled.",
			"- The page remains readable and usable on mobile and desktop widths."
		];
	}
	if (/security|offensive|low-level security|network security/.test(source)) {
		return [
			"- The lab uses only approved local or owned targets.",
			"- Findings are written as evidence plus impact, not as vague observations.",
			"- The final work includes a safe remediation, detection, or hardening step."
		];
	}

	return [
		"- The work runs or presents cleanly from a fresh start.",
		"- Normal, boundary, and awkward cases have been checked.",
		"- Explain the main logic, data structure, or design decision without reading the code line by line."
	];
}

function extensionPrompt(context: CourseTextContext) {
	const source = contextText(context);

	if (/ap computer science|apcs/.test(source)) {
		return "Add a short tracing table or AP-style follow-up question that changes one condition, loop bound, or method call.";
	}
	if (/python level 1|python level 2/.test(source)) {
		return "Add input validation or one extra mode so the program handles an unexpected user response gracefully.";
	}
	if (/scratch|sprite|broadcast|clone|backdrop|green flag/.test(source)) {
		return "Add one new sprite interaction, broadcast, level change, or difficulty option that reuses the same event/state logic.";
	}
	if (/pygames?|zrect|projectile|enemy ai|game loop/.test(source)) {
		return "Add one new actor, collision rule, input mode, level state, or difficulty curve while keeping the game loop understandable.";
	}
	if (/swift|xcode|testflight|app store|simulator|bundle id/.test(source)) {
		return "Add one small screen, state transition, persistence point, accessibility improvement, or release-readiness check.";
	}
	if (
		/linux|systemd|shell|cron|permissions|processes|filesystem/.test(source)
	) {
		return "Add one diagnostic, rollback, automation, logging, or permission-hardening step that can be verified with a command.";
	}
	if (
		/network systems|dns|ports|routing|packet|tcpdump|ipv6|nat/.test(source)
	) {
		return "Add one diagnostic variation involving a different host, port, route, DNS answer, packet trace, or firewall rule.";
	}
	if (/java/.test(source)) {
		return "Add one additional method, test, or subclass/record use case while preserving the public behavior already built.";
	}
	if (/c\+\+|cpp|systems|assembly/.test(source)) {
		return "Add a debug or benchmark mode that exposes an internal state, memory decision, or performance tradeoff.";
	}
	if (/science|physics|chemistry|biology|earth|ecosystem/.test(source)) {
		return "Apply the same model to a new example and explain what would change if one variable were different.";
	}

	return "Add one small feature that requires reusing the same concept in a new situation rather than only decorating the output.";
}

function projectSupport(context: CourseTextContext) {
	return [
		`**Project goal:** Use this build to turn the prompt into a concrete artifact that demonstrates ${subjectFocus(context)}. Before starting, restate the requirements, identify the expected inputs or state, and name what the finished output should show.`,
		`**Required outcome:**\n${projectExpectations(context).join("\n")}`,
		`**Completion checks:**\n${completionChecks(context).join("\n")}`,
		`**Extension:** ${extensionPrompt(context)}`
	].join("\n\n");
}

function lessonSupport(context: CourseTextContext) {
	return [
		`**Learning sequence:** This lesson introduces ${subjectFocus(context)}. The sequence moves from vocabulary to one concrete example, then to a prediction, explanation, or small transfer task connected to the module project.`,
		`**Common pitfalls:** ${commonPitfalls(context)}`,
		"**Mastery check:** Explain the idea in your own words and complete one small transfer task independently."
	].join("\n\n");
}

function diagnosticSupport(context: CourseTextContext) {
	return [
		`**Readiness check:** This is a formative check of ${subjectFocus(context)}, not a pass/fail quiz. Attempt the prompt independently first, then use the result to identify whether the issue is ${diagnosticCategories(context)}.`,
		`**Evidence of proficiency:** ${proficiencyEvidence(context)}`,
		`**If this is difficult:** ${remediationPrompt(context)}`,
		`**Extension:** Modify the prompt so it still uses the same concept but changes one constraint, input shape, or edge case.`
	].join("\n\n");
}

function scienceSupport(context: CourseTextContext) {
	return [
		"**Remote investigation:** The activity uses shared-screen materials, notes, paper, pencil, and provided images, graphs, data, or simulations. The activity does not require beakers, kits, or household materials; any physical demonstration is optional and replaceable with a diagram or data table.",
		`**Science explanation:** Anchor the activity in ${subjectFocus(context)}. Record observations first, then build or annotate a model, and only then write the explanation.`,
		"**Output:** Complete a claim-evidence-reasoning response, a labeled diagram or data table, and one prediction about a changed condition.",
		`**Completion checks:**\n${completionChecks(context).join("\n")}`
	].join("\n\n");
}

function scienceEvidenceCheckpoint() {
	return "**CER checkpoint:** End with a claim, evidence, and reasoning response. The claim answers the question, the evidence comes from the provided image, graph, dataset, reading, or simulation, and the reasoning uses the target vocabulary to explain why the evidence supports the claim.";
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
	if (
		/network systems|dns|ports|routing|packet|tcpdump|ipv6|nat/.test(source)
	) {
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
	return [
		`**Applied studio:** **${context.item.title}** produces ${studioArtifact(context)} connected to ${subjectFocus(context)}.`,
		"**Studio focus:** Define the problem, prerequisite concepts, and success criteria. The build should make clear what is being created, what constraints matter, and what evidence will prove the work is correct.",
		`**Build sequence:**\n${projectExpectations(context).join("\n")}\n- Review the result against the original goal and record at least one improvement or bug fix.`,
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
					item.content = `${supportBaseContent(item.content)}\n\n${scienceEvidenceCheckpoint()}`;
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
	return course;
}
