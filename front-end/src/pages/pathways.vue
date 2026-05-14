<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useAppStore } from "@/stores/app";
import { courseCatalog } from "@/stores/courses/index";
import { coursePublicPathways } from "@/stores/courses/public-pathways";

defineOptions({ name: "PathwaysPage" });

const app = useAppStore();
const { isAdmin } = storeToRefs(app);
const courseNameById = new Map(
	courseCatalog.map(course => [course.id, course.name])
);
const priorityRank = {
	urgent: 0,
	soon: 1,
	later: 2
};

const sortedPathways = computed(() =>
	[...coursePublicPathways].sort(
		(a, b) =>
			priorityRank[a.priority] - priorityRank[b.priority] ||
			a.title.localeCompare(b.title)
	)
);
const coveredCourseCount = computed(() =>
	coursePublicPathways.reduce(
		(total, pathway) => total + pathway.courseIds.length,
		0
	)
);

function courseName(courseId: string) {
	return courseNameById.get(courseId) ?? courseId;
}

function priorityLabel(priority: string) {
	if (priority === "urgent") return "Build next";
	if (priority === "soon") return "Strengthen soon";
	return "Maintain";
}
</script>

<template>
	<section class="page-shell page-shell--wide pathways-page">
		<header class="pathways-hero site-surface">
			<div class="pathways-hero__copy">
				<p class="page-eyebrow">Course pathways</p>
				<h1 class="page-title">
					Course-family pathways and what each track prepares students
					to do.
				</h1>
				<p class="page-copy">
					These pages summarize prerequisites, outcomes, project
					expectations, assessment style, tooling, and safety
					boundaries for each course family. Internal priorities and
					expansion backlog details appear only for administrators.
				</p>
			</div>
			<div class="pathways-stats" aria-label="Pathway coverage summary">
				<div>
					<strong>{{ sortedPathways.length }}</strong>
					<span>Pathways</span>
				</div>
				<div>
					<strong>{{ coveredCourseCount }}</strong>
					<span>Courses covered</span>
				</div>
			</div>
		</header>

		<div class="pathways-grid">
			<article
				v-for="pathway in sortedPathways"
				:key="pathway.id"
				class="site-surface site-surface--soft pathway-card"
			>
				<div class="pathway-card__header">
					<div>
						<p class="pathway-card__eyebrow">
							{{
								isAdmin
									? priorityLabel(pathway.priority)
									: "Course pathway"
							}}
						</p>
						<h2>{{ pathway.title }}</h2>
					</div>
					<span
						v-if="isAdmin"
						class="pathway-card__priority"
						:class="`pathway-card__priority--${pathway.priority}`"
					>
						{{ pathway.priority }}
					</span>
				</div>

				<p class="pathway-card__audience">
					{{ pathway.audience }}
				</p>

				<section>
					<h3>Courses Covered</h3>
					<ul class="course-chip-list">
						<li
							v-for="courseId in pathway.courseIds"
							:key="courseId"
						>
							{{ courseName(courseId) }}
						</li>
					</ul>
				</section>

				<section>
					<h3>Prerequisite Summary</h3>
					<p>{{ pathway.prerequisiteSummary }}</p>
				</section>

				<div class="pathway-card__columns">
					<section>
						<h3>Outcomes</h3>
						<ul>
							<li
								v-for="outcome in pathway.outcomes"
								:key="outcome"
							>
								{{ outcome }}
							</li>
						</ul>
					</section>

					<section>
						<h3>Project Expectations</h3>
						<ul>
							<li
								v-for="project in pathway.projectExpectations"
								:key="project"
							>
								{{ project }}
							</li>
						</ul>
					</section>
				</div>

				<details>
					<summary>
						{{
							isAdmin
								? "Assessment, tooling, safety, and next work"
								: "Assessment, tooling, and safety"
						}}
					</summary>
					<div class="pathway-card__details">
						<section>
							<h3>Sequencing Notes</h3>
							<ul>
								<li
									v-for="note in pathway.sequencingNotes"
									:key="note"
								>
									{{ note }}
								</li>
							</ul>
						</section>

						<section>
							<h3>Assessment Style</h3>
							<ul>
								<li
									v-for="assessment in pathway.assessmentStyle"
									:key="assessment"
								>
									{{ assessment }}
								</li>
							</ul>
						</section>

						<section>
							<h3>Sources and Tooling</h3>
							<ul>
								<li
									v-for="source in pathway.sourceAndTooling"
									:key="source"
								>
									{{ source }}
								</li>
							</ul>
						</section>

						<section>
							<h3>Safety and Access</h3>
							<ul>
								<li
									v-for="boundary in pathway.safetyAndAccess"
									:key="boundary"
								>
									{{ boundary }}
								</li>
							</ul>
						</section>

						<section v-if="isAdmin">
							<h3>Expansion Backlog</h3>
							<ul>
								<li
									v-for="item in pathway.expansionBacklog"
									:key="item"
								>
									{{ item }}
								</li>
							</ul>
						</section>
					</div>
				</details>
			</article>
		</div>
	</section>
</template>

<style scoped>
.pathways-page {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.pathways-hero {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 1.5rem 2rem;
	padding: clamp(1.6rem, 3vw, 2.35rem);
}

.pathways-hero__copy {
	flex: 1 1 48rem;
	display: grid;
	gap: 0.85rem;
}

.pathways-stats {
	flex: 0 0 auto;
	display: grid;
	grid-template-columns: repeat(2, minmax(8rem, 1fr));
	border: 1px solid var(--color-border);
	border-radius: var(--radius-md);
	overflow: hidden;
	background: rgba(255, 255, 255, 0.56);
}

.pathways-stats div {
	display: grid;
	gap: 0.25rem;
	padding: 1.1rem 1.25rem;
	border-left: 1px solid var(--color-border);
}

.pathways-stats div:first-child {
	border-left: 0;
}

.pathways-stats strong {
	font-family: var(--font-display);
	font-size: clamp(1.9rem, 3vw, 2.4rem);
	line-height: 1;
	color: var(--color-ink);
}

.pathways-stats span,
.pathway-card__eyebrow {
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	color: var(--color-accent);
}

.pathways-grid {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 34rem), 1fr));
}

.pathway-card {
	display: grid;
	align-content: start;
	gap: 1.15rem;
	padding: clamp(1.35rem, 2.2vw, 1.8rem);
}

.pathway-card__header {
	display: flex;
	align-items: start;
	justify-content: space-between;
	gap: 1rem;
}

.pathway-card h2,
.pathway-card h3,
.pathway-card p,
.pathway-card ul {
	margin: 0;
}

.pathway-card h2 {
	font-size: clamp(1.55rem, 2.3vw, 2.05rem);
}

.pathway-card h3 {
	font-size: 0.95rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: var(--color-ink);
}

.pathway-card p,
.pathway-card li {
	line-height: 1.65;
	color: var(--color-ink-soft);
}

.pathway-card ul {
	display: grid;
	gap: 0.45rem;
	padding-left: 1.1rem;
}

.pathway-card__audience {
	font-size: 1.02rem;
}

.pathway-card__priority {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex: 0 0 auto;
	padding: 0.4rem 0.65rem;
	border-radius: var(--radius-pill);
	font-size: 0.72rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.pathway-card__priority--urgent {
	color: #7c2d12;
	background: rgba(251, 146, 60, 0.18);
}

.pathway-card__priority--soon {
	color: var(--color-accent);
	background: rgba(31, 92, 145, 0.11);
}

.pathway-card__priority--later {
	color: #365314;
	background: rgba(132, 204, 22, 0.15);
}

.course-chip-list {
	display: flex;
	flex-wrap: wrap;
	gap: 0.45rem;
	padding-left: 0;
	list-style: none;
}

.course-chip-list li {
	padding: 0.45rem 0.6rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-pill);
	background: rgba(255, 255, 255, 0.66);
	font-size: 0.9rem;
	font-weight: 700;
	color: var(--color-ink);
}

.pathway-card__columns,
.pathway-card__details {
	display: grid;
	gap: 1rem;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
}

.pathway-card section {
	display: grid;
	gap: 0.55rem;
}

.pathway-card details {
	border-top: 1px solid var(--color-border);
	padding-top: 1rem;
}

.pathway-card summary {
	cursor: pointer;
	font-weight: 800;
	color: var(--color-ink);
}

.pathway-card__details {
	margin-top: 1rem;
}

@media (max-width: 760px) {
	.pathways-stats {
		width: 100%;
	}

	.pathway-card__header {
		flex-direction: column;
	}
}
</style>
