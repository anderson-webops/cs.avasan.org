import type { Ref } from "vue";
import type { CourseProgress, User } from "@/stores/app";
import type { CourseDefinition, CourseModuleItem } from "@/stores/courses";
import { ref, watch } from "vue";
import { api } from "@/api";

type RefreshUsers = () => Promise<void> | void;
type LoadCourse = (courseId: string) => Promise<CourseDefinition | null>;

function unique(values: string[]) {
	return [...new Set(values.map(value => value.trim()).filter(Boolean))];
}

export function useLearnerCourseProgress(
	users: Ref<User[]>,
	loadCourse: LoadCourse,
	refreshUsers: RefreshUsers
) {
	const selectedProgressCourseIds = ref<Record<string, string>>({});
	const progressDrafts = ref<Record<string, CourseProgress[]>>({});
	const progressCourseCache = ref<Record<string, CourseDefinition | null>>(
		{}
	);
	const progressCourseLoading = ref<Record<string, boolean>>({});

	watch(
		users,
		value => {
			const nextDrafts: Record<string, CourseProgress[]> = {};
			const nextSelections = { ...selectedProgressCourseIds.value };

			for (const user of value) {
				const assignedCourseIds = user.courseAccess ?? [];
				nextDrafts[user._id] = (user.courseProgress ?? []).map(
					progress => ({
						courseId: progress.courseId,
						completedModuleIds: unique(
							progress.completedModuleIds ?? []
						),
						completedItemIds: unique(
							progress.completedItemIds ?? []
						)
					})
				);

				if (
					!nextSelections[user._id] ||
					!assignedCourseIds.includes(nextSelections[user._id])
				) {
					nextSelections[user._id] = assignedCourseIds[0] ?? "";
				}
			}

			progressDrafts.value = nextDrafts;
			selectedProgressCourseIds.value = nextSelections;
		},
		{ immediate: true }
	);

	function assignedCourseIds(userID: string) {
		return (
			users.value.find(user => user._id === userID)?.courseAccess ?? []
		);
	}

	function ensureDraft(userID: string, courseId: string): CourseProgress {
		const existing = progressDrafts.value[userID]?.find(
			progress => progress.courseId === courseId
		);

		if (existing) return existing;

		return {
			courseId,
			completedModuleIds: [],
			completedItemIds: []
		};
	}

	function updateDraft(
		userID: string,
		courseId: string,
		updater: (draft: CourseProgress) => CourseProgress
	) {
		const drafts = [...(progressDrafts.value[userID] ?? [])];
		const currentIndex = drafts.findIndex(
			progress => progress.courseId === courseId
		);
		const current =
			currentIndex >= 0
				? drafts[currentIndex]
				: ensureDraft(userID, courseId);
		const next = updater({
			courseId,
			completedModuleIds: [...current.completedModuleIds],
			completedItemIds: [...current.completedItemIds]
		});

		if (currentIndex >= 0) drafts[currentIndex] = next;
		else drafts.push(next);

		progressDrafts.value = {
			...progressDrafts.value,
			[userID]: drafts
		};
	}

	async function loadProgressCourse(courseId: string) {
		if (!courseId || courseId in progressCourseCache.value) return;

		progressCourseLoading.value = {
			...progressCourseLoading.value,
			[courseId]: true
		};

		try {
			const course = await loadCourse(courseId);
			progressCourseCache.value = {
				...progressCourseCache.value,
				[courseId]: course
			};
		} finally {
			progressCourseLoading.value = {
				...progressCourseLoading.value,
				[courseId]: false
			};
		}
	}

	async function selectProgressCourse(userID: string, courseId: string) {
		selectedProgressCourseIds.value = {
			...selectedProgressCourseIds.value,
			[userID]: courseId
		};
		await loadProgressCourse(courseId);
	}

	function selectedProgressCourseId(userID: string) {
		return selectedProgressCourseIds.value[userID] ?? "";
	}

	async function loadSelectedProgressCourse(userID: string) {
		await loadProgressCourse(selectedProgressCourseIds.value[userID] ?? "");
	}

	function progressCourseForUser(userID: string) {
		const courseId = selectedProgressCourseIds.value[userID];
		if (!courseId) return null;
		return progressCourseCache.value[courseId] ?? null;
	}

	function isProgressCourseLoading(userID: string) {
		const courseId = selectedProgressCourseIds.value[userID];
		return !!courseId && !!progressCourseLoading.value[courseId];
	}

	function isModuleComplete(
		userID: string,
		courseId: string,
		moduleId: string
	) {
		return ensureDraft(userID, courseId).completedModuleIds.includes(
			moduleId
		);
	}

	function isItemComplete(
		userID: string,
		courseId: string,
		item: CourseModuleItem
	) {
		return ensureDraft(userID, courseId).completedItemIds.includes(item.id);
	}

	function toggleModule(
		userID: string,
		courseId: string,
		moduleId: string,
		checked: boolean
	) {
		updateDraft(userID, courseId, draft => ({
			...draft,
			completedModuleIds: checked
				? unique([...draft.completedModuleIds, moduleId])
				: draft.completedModuleIds.filter(id => id !== moduleId)
		}));
	}

	function toggleItem(
		userID: string,
		courseId: string,
		item: CourseModuleItem,
		checked: boolean
	) {
		updateDraft(userID, courseId, draft => ({
			...draft,
			completedItemIds: checked
				? unique([...draft.completedItemIds, item.id])
				: draft.completedItemIds.filter(id => id !== item.id)
		}));
	}

	function progressSummary(userID: string, courseId: string) {
		const draft = ensureDraft(userID, courseId);
		return {
			completedModuleCount: draft.completedModuleIds.length,
			completedItemCount: draft.completedItemIds.length
		};
	}

	async function saveProgress(userID: string) {
		const courseId = selectedProgressCourseIds.value[userID];
		if (!courseId) return;

		const draft = ensureDraft(userID, courseId);
		await api.put(`/users/${userID}/course-progress`, {
			courseId,
			completedModuleIds: draft.completedModuleIds,
			completedItemIds: draft.completedItemIds
		});
		await refreshUsers();
	}

	return {
		assignedCourseIds,
		isItemComplete,
		isModuleComplete,
		isProgressCourseLoading,
		loadSelectedProgressCourse,
		progressCourseForUser,
		progressSummary,
		saveProgress,
		selectProgressCourse,
		selectedProgressCourseId,
		selectedProgressCourseIds,
		toggleItem,
		toggleModule
	};
}

export type LearnerCourseProgressController = ReturnType<
	typeof useLearnerCourseProgress
>;
