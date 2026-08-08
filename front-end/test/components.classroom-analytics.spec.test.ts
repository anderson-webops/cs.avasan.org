import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ClassroomAnalytics from "@/components/ClassroomAnalytics.vue";
import { fetchAdminClassroomAnalytics } from "@/modules/classroomAnalytics";

vi.mock("@/modules/classroomAnalytics", () => ({
	fetchAdminClassroomAnalytics: vi.fn()
}));

function activity(
	courseId: string,
	label: string,
	courseOpens: number,
	tool: "graph" | "ide"
) {
	return {
		courses: [{ courseId, label, opens: courseOpens }],
		daily: [
			{
				courseOpens,
				date: "2026-07-29",
				graphOpens: tool === "graph" ? 3 : 0,
				ideOpens: tool === "ide" ? 4 : 0
			}
		],
		totals: {
			courseOpens,
			graphOpens: tool === "graph" ? 3 : 0,
			ideOpens: tool === "ide" ? 4 : 0
		}
	};
}

const summary = {
	generatedAt: "2026-07-29T20:00:00.000Z",
	period: {
		days: 30,
		endDate: "2026-07-29",
		startDate: "2026-06-30"
	},
	retentionDays: 30,
	siteActivity: {
		cs: activity(
			"python-level-1",
			"Python Level 1: Classroom Edition",
			5,
			"ide"
		),
		math: activity("algebra-1a", "Algebra 1A", 7, "graph")
	},
	studentWork: {
		activeAccounts: 12,
		activeProjects: 20,
		accountsWithRecentSignIn: 3,
		recentlyUpdatedProjects: 4,
		recentWindowDays: 7,
		studentsWithProjects: 8,
		studentsWithRecentProjectUpdates: 2
	}
};

describe("ClassroomAnalytics", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
		vi.clearAllMocks();
		vi.mocked(fetchAdminClassroomAnalytics).mockResolvedValue(
			summary as any
		);
	});

	it("shows CS, Math, and coarse optional-account activity", async () => {
		const wrapper = mount(ClassroomAnalytics);
		await flushPromises();

		expect(fetchAdminClassroomAnalytics).toHaveBeenCalledWith(30);
		expect(wrapper.text()).toContain("Computer science");
		expect(wrapper.text()).toContain("Math");
		expect(wrapper.text()).toContain(
			"Python Level 1: Classroom Edition"
		);
		expect(wrapper.text()).toContain("Algebra 1A");
		expect(wrapper.text()).toContain("Active accounts");
		expect(wrapper.text()).toContain("Active students with projects");
		expect(wrapper.text()).toContain("Projects in active accounts");
		expect(wrapper.text()).toContain(
			"Recently saved projects in active accounts"
		);
		expect(wrapper.text()).toContain("Active students who saved recently");
		expect(wrapper.text()).toContain("12");
		expect(wrapper.text()).toContain("not attendance, grades");
	});

	it("reloads a bounded teacher-selected period", async () => {
		const wrapper = mount(ClassroomAnalytics);
		await flushPromises();

		await wrapper.get("select").setValue("7");
		await flushPromises();

		expect(fetchAdminClassroomAnalytics).toHaveBeenLastCalledWith(7);
	});

	it("does not invent a retention period when analytics are unconfigured", async () => {
		vi.mocked(fetchAdminClassroomAnalytics).mockResolvedValue({
			...summary,
			retentionDays: null
		} as any);
		const wrapper = mount(ClassroomAnalytics);
		await flushPromises();

		expect(wrapper.text()).toContain(
			"Anonymous collection is disabled, and no retention period is configured."
		);
		expect(wrapper.text()).not.toContain("expire within 30 days");
	});
});
