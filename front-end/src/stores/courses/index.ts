import type { CourseSummary, RawCourse } from "./types";

export interface CourseCatalogEntry extends CourseSummary {
	load: () => Promise<RawCourse>;
}

export const courseCatalog: CourseCatalogEntry[] = [
	{
		id: "scratch-level-1",
		name: "Scratch Level 1",
		load: () =>
			import("./scratch-level-1").then(
				({ scratchLevel1Course }) => scratchLevel1Course
			)
	},
	{
		id: "scratch-level-2",
		name: "Scratch Level 2",
		load: () =>
			import("./scratch-level-2").then(
				({ scratchLevel2Course }) => scratchLevel2Course
			)
	},
	{
		id: "python-level-1",
		name: "Python Level 1",
		load: () =>
			import("./python-level-1").then(
				({ pythonLevel1Course }) => pythonLevel1Course
			)
	},
	{
		id: "pygames",
		name: "PyGames",
		load: () =>
			import("./pygames").then(({ pyGamesCourse }) => pyGamesCourse)
	},
	{
		id: "python-level-2",
		name: "Python Level 2",
		load: () =>
			import("./python-level-2").then(
				({ pythonLevel2Course }) => pythonLevel2Course
			)
	},
	{
		id: "python-level-3",
		name: "Python Level 3",
		load: () =>
			import("./python-level-3").then(
				({ pythonLevel3Course }) => pythonLevel3Course
			)
	},
	{
		id: "c-level-1",
		name: "C++ Level 1",
		load: () =>
			import("./cpp-level-1").then(
				({ cppLevel1Course }) => cppLevel1Course
			)
	},
	{
		id: "java-level-1",
		name: "Java Level 1",
		load: () =>
			import("./java-level-1").then(
				({ javaLevel1Course }) => javaLevel1Course
			)
	},
	{
		id: "java-level-2",
		name: "Java Level 2",
		load: () =>
			import("./java-level-2").then(
				({ javaLevel2Course }) => javaLevel2Course
			)
	},
	{
		id: "java-level-3",
		name: "Java Level 3",
		load: () =>
			import("./java-level-3").then(
				({ javaLevel3Course }) => javaLevel3Course
			)
	},
	{
		id: "intro-to-physics",
		name: "Intro to Physics",
		load: () =>
			import("./intro-to-physics").then(
				({ introToPhysicsCourse }) => introToPhysicsCourse
			)
	},
	{
		id: "physics-level-2",
		name: "Physics Level 2",
		load: () =>
			import("./physics-level-2").then(
				({ physicsLevel2Course }) => physicsLevel2Course
			)
	},
	{
		id: "intro-to-swift-app-development",
		name: "Intro to Swift App Development",
		load: () =>
			import("./intro-to-swift-app-development").then(
				({ introToSwiftAppDevelopmentCourse }) =>
					introToSwiftAppDevelopmentCourse
			)
	},
	{
		id: "linux-systems",
		name: "Linux Systems",
		load: () =>
			import("./linux-systems").then(
				({ linuxSystemsCourse }) => linuxSystemsCourse
			)
	},
	{
		id: "javascript-level-1-javascript-superstar",
		name: "JavaScript Level 1: JavaScript Superstar",
		load: () =>
			import("./javascript-level-1").then(
				({ javascriptLevel1Course }) => javascriptLevel1Course
			)
	},
	{
		id: "javascript-level-2-javascript-master",
		name: "JavaScript Level 2: JavaScript Master",
		load: () =>
			import("./javascript-level-2").then(
				({ javascriptLevel2Course }) => javascriptLevel2Course
			)
	},
	{
		id: "web-development-foundations",
		name: "Web Development Foundations",
		load: () =>
			import("./web-development-foundations").then(
				({ webDevelopmentFoundationsCourse }) =>
					webDevelopmentFoundationsCourse
			)
	},
	{
		id: "machine-learning",
		name: "Machine Learning",
		load: () =>
			import("./machine-learning").then(
				({ machineLearningCourse }) => machineLearningCourse
			)
	},
	{
		id: "low-level-security",
		name: "Low Level Security",
		load: () =>
			import("./low-level-security").then(
				({ lowLevelSecurityCourse }) => lowLevelSecurityCourse
			)
	},
	{
		id: "low-level-security-part-2",
		name: "Low Level Security Part 2",
		load: () =>
			import("./low-level-security-part-2").then(
				({ lowLevelSecurityPart2Course }) => lowLevelSecurityPart2Course
			)
	}
];

const courseCatalogById = new Map(
	courseCatalog.map(entry => [entry.id, entry])
);

export function getCourseCatalogEntry(id: string) {
	return courseCatalogById.get(id) ?? null;
}

export async function loadRawCourse(id: string) {
	return (await getCourseCatalogEntry(id)?.load()) ?? null;
}
