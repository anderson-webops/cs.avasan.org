<script lang="ts" setup>
import type {
	ClassroomAnalyticsSummary,
	ClassroomSiteActivity
} from "@/modules/classroomAnalytics";
import { computed, onMounted, ref } from "vue";
import { clearAdminSessionOnAuthorizationError } from "@/modules/adminSession";
import { fetchAdminClassroomAnalytics } from "@/modules/classroomAnalytics";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const days = ref<7 | 30 | 90>(30);
const loading = ref(true);
const error = ref("");
const summary = ref<ClassroomAnalyticsSummary | null>(null);

const dailyRows = computed(() => {
	const csRows = new Map(
		(summary.value?.siteActivity.cs.daily ?? []).map(row => [row.date, row])
	);
	return (summary.value?.siteActivity.math.daily ?? [])
		.map(math => ({
			date: math.date,
			csCourseOpens: csRows.get(math.date)?.courseOpens ?? 0,
			csIdeOpens: csRows.get(math.date)?.ideOpens ?? 0,
			mathCourseOpens: math.courseOpens,
			mathGraphOpens: math.graphOpens
		}))
		.reverse();
});

function formatDate(value: string) {
	const date = new Date(`${value}T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return value;
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		timeZone: "UTC"
	}).format(date);
}

function formatGeneratedAt(value: string) {
	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? value
		: new Intl.DateTimeFormat("en-US", {
				dateStyle: "medium",
				timeStyle: "short"
			}).format(date);
}

function totalActivity(activity: ClassroomSiteActivity) {
	return (
		activity.totals.courseOpens +
		activity.totals.ideOpens +
		activity.totals.graphOpens
	);
}

async function loadSummary() {
	loading.value = true;
	error.value = "";
	try {
		summary.value = await fetchAdminClassroomAnalytics(days.value);
	} catch (caught: unknown) {
		if (clearAdminSessionOnAuthorizationError(caught, app)) {
			summary.value = null;
			return;
		}
		error.value = "Couldn’t load classroom activity.";
	} finally {
		loading.value = false;
	}
}

onMounted(loadSummary);
</script>

<template>
	<section
		id="analytics"
		class="classroom-analytics"
		aria-labelledby="classroom-analytics-title"
	>
		<div class="classroom-analytics__heading">
			<div>
				<h2 id="classroom-analytics-title" tabindex="-1">
					Classroom activity
				</h2>
				<p>
					Anonymous directional counts from CS and Math, plus coarse
					optional-account activity.
				</p>
			</div>
			<label>
				Period
				<select v-model="days" @change="loadSummary">
					<option :value="7">7 days</option>
					<option :value="30">30 days</option>
					<option :value="90">90 days</option>
				</select>
			</label>
		</div>

		<p class="classroom-analytics__notice">
			Use these low-stakes totals to notice broad engagement patterns.
			They are not attendance, grades, or evidence about an individual
			student.
		</p>
		<p v-if="loading" aria-live="polite">Loading activity…</p>
		<p v-else-if="error" class="classroom-analytics__error" role="alert">
			{{ error }}
		</p>

		<template v-else-if="summary">
			<div class="classroom-analytics__sites">
				<article
					v-for="site in ['cs', 'math'] as const"
					:key="site"
					class="classroom-analytics__site"
				>
					<h3>{{ site === "cs" ? "Computer science" : "Math" }}</h3>
					<strong class="classroom-analytics__total">
						{{ totalActivity(summary.siteActivity[site]) }}
					</strong>
					<span>recorded opens</span>
					<dl class="classroom-analytics__metrics">
						<div>
							<dt>Courses</dt>
							<dd>
								{{
									summary.siteActivity[site].totals
										.courseOpens
								}}
							</dd>
						</div>
						<div v-if="site === 'cs'">
							<dt>IDE</dt>
							<dd>
								{{ summary.siteActivity.cs.totals.ideOpens }}
							</dd>
						</div>
						<div v-else>
							<dt>Grapher</dt>
							<dd>
								{{
									summary.siteActivity.math.totals.graphOpens
								}}
							</dd>
						</div>
					</dl>
					<table>
						<caption>
							Course opens
						</caption>
						<thead>
							<tr>
								<th scope="col">Course</th>
								<th scope="col">Opens</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="course in summary.siteActivity[site]
									.courses"
								:key="course.courseId"
							>
								<th scope="row">{{ course.label }}</th>
								<td>{{ course.opens }}</td>
							</tr>
						</tbody>
					</table>
				</article>
			</div>

			<section
				class="classroom-analytics__student-work"
				aria-labelledby="student-work-summary-title"
			>
				<h3 id="student-work-summary-title">
					Optional account activity
				</h3>
				<dl class="classroom-analytics__metrics">
					<div>
						<dt>Active accounts</dt>
						<dd>{{ summary.studentWork.activeAccounts }}</dd>
					</div>
					<div>
						<dt>
							Accounts signed in during
							{{ summary.studentWork.recentWindowDays }} days
						</dt>
						<dd>
							{{ summary.studentWork.accountsWithRecentSignIn }}
						</dd>
					</div>
					<div>
						<dt>Active students with projects</dt>
						<dd>
							{{ summary.studentWork.studentsWithProjects }}
						</dd>
					</div>
					<div>
						<dt>Projects in active accounts</dt>
						<dd>{{ summary.studentWork.activeProjects }}</dd>
					</div>
					<div>
						<dt>Recently saved projects in active accounts</dt>
						<dd>
							{{ summary.studentWork.recentlyUpdatedProjects }}
						</dd>
					</div>
					<div>
						<dt>Active students who saved recently</dt>
						<dd>
							{{
								summary.studentWork
									.studentsWithRecentProjectUpdates
							}}
						</dd>
					</div>
				</dl>
			</section>

			<details class="classroom-analytics__daily">
				<summary>Daily totals</summary>
				<div class="classroom-analytics__table-wrap">
					<table>
						<thead>
							<tr>
								<th scope="col">Date</th>
								<th scope="col">CS courses</th>
								<th scope="col">IDE</th>
								<th scope="col">Math courses</th>
								<th scope="col">Grapher</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="row in dailyRows" :key="row.date">
								<th scope="row">{{ formatDate(row.date) }}</th>
								<td>{{ row.csCourseOpens }}</td>
								<td>{{ row.csIdeOpens }}</td>
								<td>{{ row.mathCourseOpens }}</td>
								<td>{{ row.mathGraphOpens }}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</details>

			<p class="classroom-analytics__meta">
				Generated {{ formatGeneratedAt(summary.generatedAt) }}. Daily
				anonymous rows expire within {{ summary.retentionDays }} days.
			</p>
		</template>
	</section>
</template>

<style scoped>
.classroom-analytics {
	display: grid;
	gap: 1rem;
	scroll-margin-top: 1rem;
}

.classroom-analytics__heading {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 0.8rem;
}

.classroom-analytics__heading p,
.classroom-analytics__meta {
	margin: 0.3rem 0 0;
	color: var(--color-ink-soft);
}

.classroom-analytics__heading label {
	display: grid;
	gap: 0.3rem;
	font-weight: 800;
}

.classroom-analytics select {
	min-height: 2.6rem;
	padding: 0.4rem 0.7rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: white;
}

.classroom-analytics__notice {
	margin: 0;
	padding: 0.8rem 0.9rem;
	border-radius: var(--radius-sm);
	background: var(--color-accent-soft);
	color: var(--color-ink-soft);
}

.classroom-analytics__error {
	color: var(--color-error-text);
	font-weight: 800;
}

.classroom-analytics__sites {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 0.9rem;
}

.classroom-analytics__site,
.classroom-analytics__student-work {
	display: grid;
	gap: 0.65rem;
	padding: 1rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
}

.classroom-analytics__total {
	font-family: var(--font-display);
	font-size: clamp(2rem, 6vw, 3.25rem);
	line-height: 1;
}

.classroom-analytics__metrics {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
	gap: 0.6rem;
	margin: 0;
}

.classroom-analytics__metrics div {
	padding: 0.7rem;
	border-radius: var(--radius-sm);
	background: rgba(15, 118, 110, 0.08);
}

.classroom-analytics__metrics dt {
	color: var(--color-ink-soft);
	font-size: 0.82rem;
	font-weight: 800;
}

.classroom-analytics__metrics dd {
	margin: 0.15rem 0 0;
	font-size: 1.35rem;
	font-weight: 900;
}

.classroom-analytics table {
	width: 100%;
	border-collapse: collapse;
	font-size: 0.9rem;
}

.classroom-analytics caption {
	padding: 0.25rem 0;
	color: var(--color-ink);
	font-weight: 900;
	text-align: left;
}

.classroom-analytics th,
.classroom-analytics td {
	padding: 0.45rem;
	border-bottom: 1px solid var(--color-border);
	text-align: left;
	vertical-align: top;
}

.classroom-analytics td:last-child {
	text-align: right;
}

.classroom-analytics__daily summary {
	cursor: pointer;
	font-weight: 900;
}

.classroom-analytics__table-wrap {
	overflow-x: auto;
	margin-top: 0.65rem;
}

@media (max-width: 800px) {
	.classroom-analytics__sites {
		grid-template-columns: 1fr;
	}
}
</style>
