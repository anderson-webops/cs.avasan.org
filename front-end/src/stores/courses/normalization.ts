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

function compactLessonPointText(text: string) {
	return compactWhitespace(text)
		.replace(/[.!?]+/g, ",")
		.replace(/,+$/g, "");
}

function lessonArcContent(items: RawCourseModuleItem[]) {
	const points = items.map((item, index) => {
		const title = compactLessonPointText(item.title);
		const content = compactLessonPointText(item.content);
		return `${index + 1}) ${title}: ${content}`;
	});

	return `This lesson arc covers these sections in sequence: ${points.join("; ")}.`;
}

function enrichBriefConceptLesson(item: RawCourseModuleItem) {
	if (compactWhitespace(item.content).length >= 220) return item;

	return {
		...item,
		content: `${compactWhitespace(item.content)} Define the core vocabulary, study one concrete example, predict or explain the next step, and connect the idea to the module project before moving on.`
	};
}

function groupConceptLessons(items: RawCourseModuleItem[]) {
	if (items.length <= 4) {
		return [
			{
				title: "Core Concepts and Learning Sequence",
				content: lessonArcContent(items)
			}
		];
	}

	const midpoint = Math.ceil(items.length / 2);
	return [
		{
			title: "Core Concepts and Learning Sequence",
			content: lessonArcContent(items.slice(0, midpoint))
		},
		{
			title: "Application, Misconceptions, and Readiness Check",
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
	/\*\*(?:Project goal|Teaching flow|Learning sequence|Diagnostic guidance|Readiness check|Misconception check|Common pitfalls|Exit check|Mastery check|Remote investigation|Science explanation|Studio focus|AP connection):?\*\*/i;

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

function neutralizeStudentFacingText(text: string) {
	return text
		.replace(
			/\bCore Concepts and Teaching Flow\b/g,
			"Core Concepts and Learning Sequence"
		)
		.replace(/\*\*Teaching flow:\*\*/gi, "**Learning sequence:**")
		.replace(/\*\*Diagnostic guidance:\*\*/gi, "**Readiness check:**")
		.replace(/\*\*Misconception check:\*\*/gi, "**Common pitfalls:**")
		.replace(/\*\*Exit check:\*\*/gi, "**Mastery check:**")
		.replace(
			/Use this as one instructor-led lesson arc covering these sections in sequence:/gi,
			"This lesson arc covers these sections in sequence:"
		)
		.replace(
			/Treat this as an instructor-led explanation of ([^.]+)\./gi,
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
		.replace(/\bAsk the student why\b/g, "Consider why")
		.replace(/\bAsk the student\b/g, "Consider")
		.replace(/\bask the student to ([a-z])/g, keepMatchedFirstLetter)
		.replace(
			/\bso the student can work faster, with less prompting, and with cleaner reasoning\b/gi,
			"to build speed, independence, and cleaner reasoning"
		)
		.replace(/\bso the student can ([a-z])/g, toMatchedFirstLetter)
		.replace(
			/\benough that the student can ([a-z])/g,
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
		.replace(/\bAsk students why\b/g, "Explain why")
		.replace(/\bask students why\b/g, "explain why")
		.replace(/\bAsk students what\b/g, "Consider what")
		.replace(/\bask students what\b/g, "consider what")
		.replace(/\bAsk students whether\b/g, "Evaluate whether")
		.replace(/\bask students whether\b/g, "evaluate whether")
		.replace(/\bAsk students to ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\bask students to ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bhave students ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bLet the student ([a-z])/g, capitalizeMatchedFirstLetter)
		.replace(/\blet the student ([a-z])/g, keepMatchedFirstLetter)
		.replace(/\bThe student should be able to\b/g, "Be able to")
		.replace(/\bStudents should be able to\b/g, "Be able to")
		.replace(/\bthe student should be able to\b/g, "be able to")
		.replace(/\bstudents should be able to\b/g, "be able to")
		.replace(/\bThe student should\b/g, "The expected result should")
		.replace(/\bStudents should\b/g, "The expected result should")
		.replace(/\bthe student should\b/g, "the expected result should")
		.replace(/\bstudents should\b/g, "the expected result should")
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
		/Core Concepts and Learning Sequence|Application, Misconceptions, and Readiness Check/.test(
			context.item.title
		) ||
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
	if (/web|html|css|full-stack|api|database/.test(source)) {
		return "web development workflow: user-facing behavior, browser checks, API/data flow, accessibility, and deployment readiness";
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
	if (isScienceContext(context)) {
		return "scientific explanation: observable phenomena, models, data, vocabulary, and claim-evidence-reasoning";
	}
	if (/algebra|geometry|calculus|math/.test(source)) {
		return "mathematical reasoning: worked examples, notation, graph or table interpretation, and explanation of each step";
	}

	return "the module's core concept, a concrete worked example, and a testable artifact";
}

function projectExpectations(context: CourseTextContext) {
	const source = contextText(context);

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
	if (/file|parser|csv|json|io|input.*output/.test(source)) {
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
		"- Keep the final result explainable: the student should be able to describe the main design choice and one bug they fixed."
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
	if (/web|html|css|api|database|full-stack/.test(source)) {
		return [
			"- The feature works from a fresh page load without relying on hidden state.",
			"- Empty, loading, success, and failure states are visible or intentionally handled.",
			"- The page remains readable and usable on mobile and desktop widths."
		];
	}
	if (/security|offensive|network/.test(source)) {
		return [
			"- The lab uses only approved local or owned targets.",
			"- Findings are written as evidence plus impact, not as vague observations.",
			"- The student includes a safe remediation, detection, or hardening step."
		];
	}
	if (/science|physics|chemistry|biology|earth|ecosystem/.test(source)) {
		return [
			"- The explanation names the phenomenon, the model or data source, and the target vocabulary.",
			"- Separate observation from inference.",
			"- The final answer includes a claim, evidence, and reasoning connection."
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
		`**Learning sequence:** This lesson introduces ${subjectFocus(context)}. Start with vocabulary, work through one concrete example, predict the next step, and connect the example back to the project or practice task in this module.`,
		"**Common pitfalls:** Watch for likely mistakes such as mixing up a value with its representation, using the wrong loop or condition, assuming hidden state, or skipping the reason a step is valid.",
		"**Mastery check:** Explain the idea in your own words and complete one small transfer task without copying the demonstration."
	].join("\n\n");
}

function diagnosticSupport(context: CourseTextContext) {
	return [
		`**Readiness check:** Use this as a formative check of ${subjectFocus(context)}, not as a pass/fail quiz. Attempt the prompt independently first, then use the result to identify whether the issue is vocabulary, tracing, syntax, design, or test coverage.`,
		"**Evidence of proficiency:** Explain the rule, apply it to a new example, correct a small mistake, and describe how the result is known to be correct.",
		"**If this is difficult:** Record the specific misconception, complete one focused remediation problem, and revisit the same skill before moving to a more complex project.",
		`**Extension:** Modify the prompt so it still uses the same concept but changes one constraint, input shape, or edge case.`
	].join("\n\n");
}

function scienceSupport(context: CourseTextContext) {
	return [
		"**Remote investigation:** Use shared-screen materials, notes, paper, pencil, and provided images, graphs, data, or simulations. Do not require beakers, kits, or household materials; any physical demonstration should be optional and replaceable with a diagram or data table.",
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
		`Use this studio as a complete build-and-review session for **${context.item.title}**. The expected artifact is ${studioArtifact(context)}, and the session should be anchored in ${subjectFocus(context)} rather than left as an open-ended placeholder.`,
		"**Studio focus:** Start by naming the problem, prerequisite concepts, and success criteria. The build should make clear what is being created, what constraints matter, and what evidence will prove the work is correct.",
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

				const currentContent = compactWhitespace(item.content);
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
					item.content = `${compactWhitespace(item.content)}\n\n${scienceEvidenceCheckpoint()}`;
				}
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
	const duplicateCheckIns = new Set([
		"Applied Studio 16: JM Check in 2",
		"Applied Studio 17: JM Check in 2"
	]);

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
		"Applied Studio 11: c algorithm lab 11",
		"Applied Studio 12: c algorithm lab 12",
		"Applied Studio 13: c algorithm lab 13",
		"Applied Studio 14: c algorithm lab 14",
		"Applied Studio 15: c algorithm lab 15",
		"Applied Studio 16: c algorithm lab 16",
		"Applied Studio 17: c algorithm lab 17"
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
		"Applied Studio 11: AJ Check In 3",
		"Applied Studio 12: AJ Check in 4",
		"Applied Studio 13: Flower Class",
		"Applied Studio 14: Sum of the First N"
	]);

	removeModules(course, module => mixedJavaLevelModules.has(module.title));
	renameModule(
		course,
		"Applied Studio 15: pattern implementation lab 15",
		"Applied Studio 11: pattern implementation lab 15"
	);
	renameModule(
		course,
		"Applied Studio 16: pattern implementation lab 16",
		"Applied Studio 12: pattern implementation lab 16"
	);
	renameModule(
		course,
		"Applied Studio 17: pattern implementation lab 17",
		"Applied Studio 13: pattern implementation lab 17"
	);
}

function normalizePythonicDesignPatterns(course: RawCourse) {
	removeModules(course, module => module.title.startsWith("Applied Studio"));
}

function normalizeLowLevelSecurity(course: RawCourse) {
	removeModules(
		course,
		module =>
			/^Applied Studio (?:9|10|11):/.test(module.title) &&
			!/low[- ]level security lab/i.test(module.title)
	);
	renameModule(
		course,
		"Applied Studio 12: low level security lab 7",
		"Applied Studio 9: low level security lab 7"
	);
	renameModule(
		course,
		"Applied Studio 13: low level security lab 8",
		"Applied Studio 10: low level security lab 8"
	);
	renameModule(
		course,
		"Applied Studio 14: low level security lab 9",
		"Applied Studio 11: low level security lab 9"
	);
	renameModule(
		course,
		"Applied Studio 15: low level security lab 10",
		"Applied Studio 12: low level security lab 10"
	);
	renameModule(
		course,
		"Applied Studio 16: low level security lab 11",
		"Applied Studio 13: low level security lab 11"
	);
	renameModule(
		course,
		"Applied Studio 17: low level security lab 12",
		"Applied Studio 14: low level security lab 12"
	);
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
	removeModules(course, module => module.title.startsWith("Applied Studio"));

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
	normalizeCourseTextQuality(course, id);
	neutralizeStudentFacingCourseText(course);
	return course;
}
