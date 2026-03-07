import type { CourseDefinition, CourseModuleItem } from "./courses/types";
import { defineStore } from "pinia";

import { computed } from "vue";
import { rawCourses } from "./courses/index";

export type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "./courses/types";

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036F]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
}

function normalizeContent(content: string): string {
	const paragraphs = content
		.split(/\n{2,}/)
		.map(part => part.trim())
		.filter(Boolean)
		.filter(part => !/instructor note/i.test(part));
	return paragraphs
		.join("\n\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

const normalizedCourses: CourseDefinition[] = rawCourses.map(course => {
	const courseId = slugify(course.name);

	return {
		id: courseId,
		name: course.name,
		modules: course.modules.map(module => {
			const moduleId = slugify(`${courseId}-${module.title}`);

			const mapItems = (
				items: typeof module.curriculum,
				prefix: string
			): CourseModuleItem[] =>
				items
					.filter(item => !shouldHideItem(item.title))
					.map(item => ({
						id: slugify(`${moduleId}-${prefix}-${item.title}`),
						title: item.title,
						content: normalizeContent(item.content),
						projectLink: item.projectLink,
						solutionLink: item.solutionLink,
						datasetLink: item.datasetLink,
						mediaLink: item.mediaLink
					}));

			return {
				id: moduleId,
				title: module.title,
				curriculum: mapItems(module.curriculum, "curriculum"),
				supplementalProjects: mapItems(
					module.supplementalProjects,
					"supplemental"
				)
			};
		})
	};
});

export const useCoursesStore = defineStore("courses", () => {
	const courses = computed(() => normalizedCourses);

	function getCourseById(id: string) {
		return courses.value.find(course => course.id === id) ?? null;
	}

	return {
		courses,
		getCourseById
	};
});
