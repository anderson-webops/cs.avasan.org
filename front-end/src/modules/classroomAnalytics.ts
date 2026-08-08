import { api } from "@/api";

export interface ClassroomActivityDay {
	date: string;
	courseOpens: number;
	graphOpens: number;
	ideOpens: number;
}

export interface ClassroomCourseActivity {
	courseId: string;
	label: string;
	opens: number;
}

export interface ClassroomSiteActivity {
	totals: {
		courseOpens: number;
		graphOpens: number;
		ideOpens: number;
	};
	daily: ClassroomActivityDay[];
	courses: ClassroomCourseActivity[];
}

export interface ClassroomAnalyticsSummary {
	generatedAt: string;
	period: {
		days: number;
		startDate: string;
		endDate: string;
	};
	retentionDays: number | null;
	siteActivity: {
		cs: ClassroomSiteActivity;
		math: ClassroomSiteActivity;
	};
	studentWork: {
		recentWindowDays: number;
		activeAccounts: number;
		accountsWithRecentSignIn: number;
		studentsWithProjects: number;
		studentsWithRecentProjectUpdates: number;
		activeProjects: number;
		recentlyUpdatedProjects: number;
	};
}

export async function fetchAdminClassroomAnalytics(days: 7 | 30 | 90) {
	const { data } = await api.get<ClassroomAnalyticsSummary>(
		"/admins/classroom-analytics/summary",
		{ params: { days } }
	);
	return data;
}
