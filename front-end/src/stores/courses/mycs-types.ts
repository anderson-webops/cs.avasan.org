export type MyCsDestination =
	| "s1-events"
	| "s1-position"
	| "s1-dialogue"
	| "s1-loops"
	| "s1-conditions"
	| "s1-variables"
	| "s2-review"
	| "s2-conditions"
	| "s2-strings"
	| "s2-math"
	| "s2-lists"
	| "s2-functions"
	| "s2-master"
	| "s2-simulation";

export interface MyCsLesson {
	id: string;
	title: string;
	sourcePath: string;
	sourceSite?: "teacher" | "student";
	relatedSourcePaths?: string[];
	destination: MyCsDestination;
	content: string;
	starter?: string;
}
