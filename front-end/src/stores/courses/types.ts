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

export interface RawCourse {
	name: string;
	modules: RawCourseModule[];
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
}
