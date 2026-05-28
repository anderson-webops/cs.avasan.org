export interface RawCourseModuleItem {
	id?: string;
	aliases?: string[];
	title: string;
	content: string;
	projectLink?: string;
	solutionLink?: string;
	datasetLink?: string;
	mediaLink?: string;
}

export interface RawCourseModule {
	id?: string;
	aliases?: string[];
	kind?: "module" | "appendix";
	title: string;
	curriculum: RawCourseModuleItem[];
	supplementalProjects: RawCourseModuleItem[];
}

export interface CourseDevelopmentMetadata {
	priority: "urgent" | "soon" | "later";
	standards: string[];
	sourcePolicy: string;
	assessmentCadence: string[];
	toolchain: string[];
	safetyPolicy: string[];
	courseBoundaries: string[];
	capstoneExpectations: string[];
	recommendedNextWork: string[];
}

export interface RawCourse {
	name: string;
	modules: RawCourseModule[];
	developmentMetadata?: CourseDevelopmentMetadata;
}

export interface CourseSummary {
	id: string;
	name: string;
}

export interface CourseModuleItem extends RawCourseModuleItem {
	id: string;
	aliases?: string[];
}

export interface CourseModule {
	id: string;
	aliases?: string[];
	kind?: "module" | "appendix";
	title: string;
	curriculum: CourseModuleItem[];
	supplementalProjects: CourseModuleItem[];
}

export interface CourseDefinition extends CourseSummary {
	modules: CourseModule[];
	developmentMetadata?: CourseDevelopmentMetadata;
}
