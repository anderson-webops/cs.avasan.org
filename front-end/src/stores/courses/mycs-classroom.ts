import type { MyCsDestination, MyCsLesson } from "./mycs-types";
import type { RawCourse, RawCourseModuleItem } from "./types";
import { myCsConditionsProcedures } from "./mycs-conditions-procedures";
import { myCsFoundationsCapstones } from "./mycs-foundations-capstones";
import { myCsIntroEventsLoops } from "./mycs-intro-events-loops";

export const myCsClassroomLessons: MyCsLesson[] = [
	...myCsIntroEventsLoops,
	...myCsConditionsProcedures,
	...myCsFoundationsCapstones
];

export const myCsDestinations: Record<
	MyCsDestination,
	{ courseId: string; moduleTitle: string }
> = {
	"s1-events": {
		courseId: "scratch-level-1",
		moduleTitle: "1. Events and movement"
	},
	"s1-position": {
		courseId: "scratch-level-1",
		moduleTitle: "2. Position and reset"
	},
	"s1-dialogue": {
		courseId: "scratch-level-1",
		moduleTitle: "3. Dialogue and scenes"
	},
	"s1-loops": {
		courseId: "scratch-level-1",
		moduleTitle: "4. Loops and animation"
	},
	"s1-conditions": {
		courseId: "scratch-level-1",
		moduleTitle: "5. Conditions and decisions"
	},
	"s1-variables": {
		courseId: "scratch-level-1",
		moduleTitle: "6. Variables and games"
	},
	"s2-review": {
		courseId: "scratch-level-2",
		moduleTitle: "GM1 Review: Events, Loops, Conditionals, & Broadcasting"
	},
	"s2-conditions": {
		courseId: "scratch-level-2",
		moduleTitle: "GM3 Complex Conditionals"
	},
	"s2-strings": { courseId: "scratch-level-2", moduleTitle: "GM5 Strings" },
	"s2-math": {
		courseId: "scratch-level-2",
		moduleTitle: "GM6 Mathematical Operators"
	},
	"s2-lists": { courseId: "scratch-level-2", moduleTitle: "GM7 Lists" },
	"s2-functions": {
		courseId: "scratch-level-2",
		moduleTitle: "GM8 Functions"
	},
	"s2-master": {
		courseId: "scratch-level-2",
		moduleTitle: "GM11 Master Project"
	},
	"s2-simulation": {
		courseId: "scratch-level-2",
		moduleTitle: "GM13 Simulation and Data Studio"
	}
};

export function myCsSourceUrl(lesson: MyCsLesson, path = lesson.sourcePath) {
	const site = lesson.sourceSite === "student" ? "mycs" : "mycs-teacher";
	return `https://sites.google.com/a/sfusd.edu/${site}/${path.replace(/^\/+/, "")}`;
}

export function myCsClassroomItem(lesson: MyCsLesson): RawCourseModuleItem {
	const sources = [lesson.sourcePath, ...(lesson.relatedSourcePaths ?? [])]
		.map(
			(path, index) =>
				`[${index === 0 ? "SFUSD CS team’s MyCS" : `continued lesson ${index + 1}`}](${myCsSourceUrl(lesson, path)})`
		)
		.join(", ");
	return {
		id: lesson.id,
		title: `MyCS: ${lesson.title}`,
		learningPath: "choice",
		content: `${lesson.content}\n\n**Source and reuse:** Rewritten from ${sources}, inspired by Harvey Mudd’s MyCS. Only this adapted guide is [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/); other course content and starter assets retain their own terms.`,
		...(lesson.starter
			? { projectLink: `/ide?mode=scratch&starter=${lesson.starter}` }
			: {})
	};
}

export function withMyCsClassroomChoices(
	course: RawCourse,
	courseId: string
): RawCourse {
	return {
		...course,
		modules: course.modules.map(module => ({
			...module,
			supplementalProjects: [
				...module.supplementalProjects,
				...myCsClassroomLessons
					.filter(lesson => {
						const destination =
							myCsDestinations[lesson.destination];
						return (
							destination.courseId === courseId &&
							destination.moduleTitle === module.title
						);
					})
					.map(myCsClassroomItem)
			]
		}))
	};
}
