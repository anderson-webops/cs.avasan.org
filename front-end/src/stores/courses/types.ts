export interface RawCourseModuleItem {
	title: string;
	content: string;
	projectLink?: string;
	solutionLink?: string;
	datasetLink?: string;
	mediaLink?: string;
}

export interface RawCourseModule {
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
}

export interface CourseModule {
	id: string;
	title: string;
	curriculum: CourseModuleItem[];
	supplementalProjects: CourseModuleItem[];
}

export interface CourseDefinition extends CourseSummary {
	modules: CourseModule[];
	developmentMetadata?: CourseDevelopmentMetadata;
}
