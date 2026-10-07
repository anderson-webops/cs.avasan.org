import type { CourseModule } from "@/stores/courses/types";
import { computed, effectScope, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";
import { useLessonViews } from "@/modules/useLessonViews";
import { lessonContentSections } from "@/modules/courseLessonPresentation";

function createModule(id = "module"): CourseModule {
	return {
		id,
		title: "Events",
		curriculum: [
			{
				id: "project",
				title: "Make a game",
				content:
					"**Objective:** Understand events. **Assignment:** Make a game."
			},
			{
				id: "concepts",
				title: "Concepts",
				content: "Events run your code."
			}
		],
		supplementalProjects: [
			{
				id: "extension",
				aliases: ["old-extension"],
				title: "Add sound",
				content: "Play a sound when clicked."
			}
		]
	};
}

function createViews(initialAnchor = "") {
	const scope = effectScope();
	const current = ref<CourseModule | null>(createModule());
	const anchor = ref(initialAnchor);
	const query = ref("");
	const views = scope.run(() =>
		useLessonViews(
			computed(() => current.value),
			anchor,
			computed(() => query.value)
		)
	)!;
	return { scope, current, anchor, query, views };
}

describe("shared lesson views", () => {
	it("keeps classroom checks required after an optional hard extension", () => {
		const sections = lessonContentSections("**Block guide:** Learn event blocks.\n\n**Normal:** Add a click event.\n\n**Hard:** Add sound.\n\n**Check:** Test the click event.\n\n**Explain:** Predict a change.");
		expect(sections.map(section => [section.label, section.kind])).toEqual([
			["Block guide", "learn"], ["Normal", "assignment"], ["Hard", "optional"], ["Check", "assignment"], ["Explain", "assignment"]
		]);
	});
	it("keeps an activity's only task with its completion evidence", () => {
		const sections = lessonContentSections(
			"**Goal:** Move a ladybug and write the new equation.\n\n**Completion evidence:** A drawing and equation.\n\n**Concept path:** Test changed conditions.\n\n**Failure modes:** Check labels."
		);
		expect(
			sections
				.filter(section => section.kind === "assignment")
				.map(section => section.content)
				.join(" ")
		).toContain("Move a ladybug");
		expect(
			sections
				.filter(section => section.kind === "learn")
				.map(section => section.content)
				.join(" ")
		).not.toContain("Move a ladybug");
	});
	it("defaults to projects and keeps concepts in Learn", () => {
		const { scope, views } = createViews();
		try {
			expect(views.lessonView.value).toBe("projects");
			expect(views.activeLessonItems.value.map(item => item.id)).toEqual([
				"project"
			]);
			expect(views.learningTopics.value[0].sections[0].content).toContain(
				"Understand events"
			);
			views.lessonView.value = "learn";
			expect(views.activeLessonItems.value.map(item => item.id)).toEqual([
				"concepts"
			]);
		} finally {
			scope.stop();
		}
	});
	it("opens bookmarked supplemental projects and historical aliases", async () => {
		const { scope, anchor, views } = createViews("module-old-extension");
		try {
			expect(views.lessonView.value).toBe("supplemental");
			anchor.value = "module-concepts";
			await nextTick();
			expect(views.lessonView.value).toBe("learn");
		} finally {
			scope.stop();
		}
	});
	it("resets the selected view when the module changes", async () => {
		const { scope, current, views } = createViews();
		try {
			views.lessonView.value = "learn";
			current.value = createModule("next-module");
			await nextTick();
			expect(views.lessonView.value).toBe("projects");
		} finally {
			scope.stop();
		}
	});
	it("shows search matches outside an empty project view", async () => {
		const { scope, current, query, views } = createViews();
		try {
			current.value = { ...createModule(), curriculum: [] };
			query.value = "sound";
			await nextTick();
			expect(views.lessonView.value).toBe("supplemental");
			expect(views.activeLessonItems.value[0].id).toBe("extension");
		} finally {
			scope.stop();
		}
	});
});
