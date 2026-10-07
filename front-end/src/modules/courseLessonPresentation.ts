import type { CourseModuleItem } from "@/stores/courses/types";
import { normalizeInlineCourseMarkdown } from "./courseMarkdown";

export type LessonView = "projects" | "supplemental" | "learn";
export interface LessonContentSection {
	kind: "assignment" | "learn" | "note" | "optional";
	label: string;
	content: string;
}

const sectionKinds: Record<string, LessonContentSection["kind"]> = {
	objective: "learn",
	objectives: "learn",
	goal: "learn",
	goals: "learn",
	"learning goals": "learn",
	"project goal": "learn",
	"concept focus": "learn",
	"concept path": "learn",
	"failure modes": "learn",
	evidence: "learn",
	"key distinction": "learn",
	concept: "learn",
	concepts: "learn",
	"key concepts": "learn",
	"key blocks": "learn",
	"block guide": "learn",
	vocabulary: "learn",
	background: "learn",
	overview: "learn",
	note: "note",
	notes: "note",
	info: "note",
	information: "note",
	"design note": "note",
	"implementation note": "note",
	tip: "note",
	hint: "note",
	reminder: "note",
	focus: "assignment",
	optional: "optional",
	challenge: "optional",
	"optional challenge": "optional",
	extension: "optional",
	bonus: "optional",
	hard: "optional",
	assignment: "assignment",
	instructions: "assignment",
	"build steps": "assignment",
	"implementation steps": "assignment",
	"practice sequence": "assignment",
	"success criteria": "assignment",
	"project instructions": "assignment",
	"your task": "assignment",
	checkpoint: "assignment",
	checkpoints: "assignment",
	check: "assignment",
	explain: "assignment",
	outcome: "assignment",
	checks: "assignment",
	requirements: "assignment",
	steps: "assignment",
	normal: "assignment",
	verification: "assignment",
	"completion check": "assignment",
	"completion evidence": "assignment",
	deliverable: "assignment"
};
const assignmentTitle =
	/\b(?:project|capstone|exercise|worksheet|quiz|problem|lab|drill|challenge|assignment|practice|activity)\b/i;
const learningTitle =
	/\b(?:introduction|overview|concepts?|basics|reference|vocabulary|reflection|planning and architecture|design and planning map|verification review|verification and reflection|debugging habit|debugging pitfalls|bug patterns)\b|^basic event listeners$/i;

export function isLessonLearningItem(
	item: Pick<CourseModuleItem, "title" | "content" | "projectLink"> & {
		ideImport?: unknown;
	}
) {
	return (
		!item.projectLink &&
		!item.ideImport &&
		!assignmentTitle.test(item.title) &&
		(learningTitle.test(item.title) ||
			/^\s*\*\*Concept focus:\*\*/i.test(item.content))
	);
}

export function lessonContentSections(content: string): LessonContentSection[] {
	if (/^ {0,3}\[[^\]\n]+\]:/m.test(content))
		return [{ kind: "assignment", label: "Assignment", content }];
	const sections: LessonContentSection[] = [];
	let current: LessonContentSection = {
		kind: "assignment",
		label: "Assignment",
		content: ""
	};
	let fence = "";
	let sectionDepth = 0;
	const finish = () => {
		if (current.content.trim()) {
			sections.push({
				...current,
				content: current.content.replace(/^\n+|\n+$/g, "")
			});
		}
	};
	for (const line of normalizeInlineCourseMarkdown(content).split("\n")) {
		const fenceMatch = line.match(/^\s{0,3}(`{3,}|~{3,})/);
		if (fenceMatch) {
			if (!fence) {
				fence = fenceMatch[1];
			} else if (
				fenceMatch[1][0] === fence[0] &&
				fenceMatch[1].length >= fence.length
			) {
				fence = "";
			}
			current.content += `${line}\n`;
			continue;
		}
		if (fence || /^\s{4}|^\t/.test(line)) {
			current.content += `${line}\n`;
			continue;
		}
		const heading = line.match(/^\s{0,3}(#{1,6})[ \t](.*)$/);
		const boldLabel = line.match(/^\s{0,3}\*\*([^*\n]{1,80})\*\*(.*)$/);
		const plainLabel = line.match(/^\s{0,3}([A-Z][A-Z ]{0,35}):(.*)$/i);
		const label = (
			heading?.[2]?.trim().replace(/[ \t]+#+$/, "") ??
			boldLabel?.[1] ??
			plainLabel?.[1] ??
			""
		)
			.replace(/:$/, "")
			.trim();
		const kind = Object.hasOwn(sectionKinds, label.toLowerCase())
			? sectionKinds[label.toLowerCase()]
			: undefined;
		if (kind) {
			finish();
			current = {
				kind,
				label,
				content: heading
					? ""
					: `${(boldLabel?.[2] ?? plainLabel?.[2] ?? "").trimStart().replace(/^:/, "").trimStart()}\n`
			};
			sectionDepth = heading?.[1].length ?? 0;
		} else if (
			(heading && heading[1].length <= sectionDepth) ||
			((boldLabel || plainLabel) && current.kind === "learn")
		) {
			finish();
			current = {
				kind: "assignment",
				label: "Assignment",
				content: `${line}\n`
			};
			sectionDepth = 0;
		} else {
			current.content += `${line}\n`;
		}
	}
	finish();
	if (
		sections.some(
			section => section.label.toLowerCase() === "completion evidence"
		) &&
		!sections.some(
			section =>
				section.kind === "assignment" &&
				section.label.toLowerCase() !== "completion evidence"
		)
	) {
		return sections.map(section =>
			/^(?:project )?goals?$/i.test(section.label)
				? { ...section, kind: "assignment", label: "Assignment" }
				: section
		);
	}
	if (sections.length && sections.every(section => section.kind === "learn"))
		return [{ kind: "assignment", label: "Assignment", content }];
	if (!sections.some(section => section.kind === "assignment")) {
		return sections.map(section =>
			section.kind === "learn"
				? { ...section, kind: "assignment" }
				: section
		);
	}
	return sections;
}
