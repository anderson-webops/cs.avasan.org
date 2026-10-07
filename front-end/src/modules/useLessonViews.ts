import type { ComputedRef, Ref } from "vue";
import type { LessonView } from "./courseLessonPresentation";
import type { CourseModule } from "@/stores/courses/types";
import { computed, ref, watch } from "vue";
import {
	isLessonLearningItem,
	lessonContentSections
} from "./courseLessonPresentation";

export function useLessonViews(
	module: ComputedRef<CourseModule | null>,
	anchor: Ref<string>,
	query: ComputedRef<string>
) {
	const lessonView = ref<LessonView>("projects");
	const lessonViews = [
		{ id: "projects", label: "Projects" },
		{ id: "supplemental", label: "Supplemental Projects" },
		{ id: "learn", label: "Learn" }
	] as const;
	const itemsByView = computed(() => ({
		projects: (module.value?.curriculum ?? []).filter(
			item => !isLessonLearningItem(item)
		),
		supplemental: (module.value?.supplementalProjects ?? []).filter(
			item => !isLessonLearningItem(item)
		),
		learn: [
			...(module.value?.curriculum ?? []),
			...(module.value?.supplementalProjects ?? [])
		].filter(isLessonLearningItem)
	}));
	const activeLessonItems = computed(
		() => itemsByView.value[lessonView.value]
	);
	const learningTopics = computed(() =>
		[...itemsByView.value.projects, ...itemsByView.value.supplemental]
			.map(item => ({
				item,
				sections: lessonContentSections(item.content).filter(
					section => section.kind === "learn"
				)
			}))
			.filter(topic => topic.sections.length)
	);
	const lessonViewLabel = computed(
		() =>
			lessonViews.find(view => view.id === lessonView.value)?.label ??
			"Projects"
	);
	watch(
		[module, anchor, query],
		([current, currentAnchor, currentQuery], previous) => {
			const changed = current?.id !== previous?.[0]?.id;
			if (changed) lessonView.value = "projects";
			if (current && (changed || currentAnchor !== previous?.[1])) {
				const matchingView = lessonViews.find(view =>
					itemsByView.value[view.id].some(item =>
						[item.id, ...(item.aliases ?? [])].some(
							id => `${current.id}-${id}` === currentAnchor
						)
					)
				);
				if (matchingView) lessonView.value = matchingView.id;
			}
			if (currentQuery && !activeLessonItems.value.length) {
				const matchingView = lessonViews.find(
					view => itemsByView.value[view.id].length
				);
				if (matchingView) lessonView.value = matchingView.id;
			}
		},
		{ immediate: true }
	);
	return {
		lessonView,
		lessonViews,
		activeLessonItems,
		learningTopics,
		lessonViewLabel
	};
}
