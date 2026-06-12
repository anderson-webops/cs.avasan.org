import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";

import { courseCatalog } from "../src/stores/courses/index.ts";
import type {
	RawCourse,
	RawCourseModuleItem
} from "../src/stores/courses/types.ts";

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const FRONTEND_DIR = path.resolve(SCRIPT_DIR, "..");
const COURSES_DIR = path.join(FRONTEND_DIR, "src/stores/courses");
const INDEX_PATH = path.join(COURSES_DIR, "index.ts");

const GENERIC_LINKED_STARTER_COPY =
	"Use the linked starter as a starting point and the reference link for comparison after the attempt. Focus on the same core idea with a different input, constraint, or edge case.";

const SIMPLE_COURSE_EXPORT_RE =
	/^import type \{ RawCourse \} from "\.\/types";\s*export const \w+: RawCourse = /s;

function inferProjectKind(courseId: string, courseName: string) {
	const source = `${courseId} ${courseName}`.toLowerCase();

	if (source.includes("swift")) return "Swift app";
	if (source.includes("web") || source.includes("javascript"))
		return "web development";
	if (source.includes("java") || source.includes("ap computer science"))
		return "Java";
	if (
		source.includes("c++") ||
		source.includes("cpp") ||
		source.includes("usaco")
	)
		return "C++";
	if (source.includes("assembly")) return "assembly";
	if (source.includes("linux")) return "Linux systems";
	if (source.includes("network")) return "network systems";
	if (source.includes("rust")) return "Rust systems";
	if (source.includes("security")) return "security lab";
	if (
		source.includes("python") ||
		source.includes("pygame") ||
		source.includes("machine learning") ||
		source.includes("data science") ||
		source.includes("ai")
	) {
		return "Python";
	}
	return "implementation";
}

function linkedProjectSpec(
	courseId: string,
	courseName: string,
	moduleTitle: string,
	itemTitle: string,
	item: RawCourseModuleItem
) {
	const projectKind = inferProjectKind(courseId, courseName);
	const isSupplemental = /supplemental|extension|practice|challenge/i.test(
		itemTitle
	);
	const projectRole = isSupplemental
		? "transfer or extension project"
		: "core implementation checkpoint";
	const solutionNote = item.solutionLink
		? "Check the draft against the expected behavior only after a working version exists."
		: "Write a short verification note with the tests or traces used as evidence.";

	return [
		`**Project goal:** Complete the linked ${projectKind} ${projectRole} for ${moduleTitle}. The project should prove the module concept through a working artifact, not only through reading the repository link.`,
		"**Required work:**",
		"1. Read the starter and identify the expected inputs, outputs, state changes, and constraints.",
		"2. Implement the missing behavior in the smallest clear steps.",
		"3. Test one normal case and one awkward or boundary case.",
		`4. ${solutionNote}`,
		"**Completion checks:**",
		"- The implemented behavior matches the module concept.",
		"- The changed or awkward case is named explicitly.",
		"- The final explanation identifies one design, debugging, or reasoning choice that mattered."
	].join("\n\n");
}

function repairItem(
	courseId: string,
	courseName: string,
	moduleTitle: string,
	item: RawCourseModuleItem
) {
	const content = item.content.trim();
	const hasLinkedResource = Boolean(item.projectLink || item.solutionLink);
	const hasGenericStarterCopy = content.includes(GENERIC_LINKED_STARTER_COPY);

	if (!hasLinkedResource) return false;

	if (content === "" || hasGenericStarterCopy) {
		item.content = linkedProjectSpec(
			courseId,
			courseName,
			moduleTitle,
			item.title,
			item
		);
		return true;
	}

	return false;
}

function repairCourse(courseId: string, course: RawCourse) {
	let changed = false;

	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			changed =
				repairItem(courseId, course.name, module.title, item) ||
				changed;
		}
	}

	return changed;
}

async function parseCourseFileMap() {
	const indexFile = await fs.readFile(INDEX_PATH, "utf8");
	const fileMap = new Map<string, string>();
	const regex = /id:\s*"([^"]+)"[\s\S]*?import\("\.\/([^"]+)"\)/g;

	for (const match of indexFile.matchAll(regex)) {
		fileMap.set(match[1], `${match[2]}.ts`);
	}

	return fileMap;
}

async function main() {
	const fileMap = await parseCourseFileMap();
	const writtenFiles = new Set<string>();
	let repairedItems = 0;

	for (const entry of courseCatalog) {
		const fileName = fileMap.get(entry.id);
		if (!fileName || writtenFiles.has(fileName)) continue;

		const filePath = path.join(COURSES_DIR, fileName);
		const originalFile = await fs.readFile(filePath, "utf8");

		if (!SIMPLE_COURSE_EXPORT_RE.test(originalFile)) {
			continue;
		}

		const exportMatch = originalFile.match(
			/export const (\w+): RawCourse =/
		);
		if (!exportMatch) continue;

		const rawCourse = await entry.load();
		const before = JSON.stringify(rawCourse);

		if (!repairCourse(entry.id, rawCourse)) {
			continue;
		}

		const after = JSON.stringify(rawCourse);
		repairedItems +=
			(before.match(new RegExp(GENERIC_LINKED_STARTER_COPY, "g")) ?? [])
				.length +
			(before.match(/"content":""/g) ?? []).length -
			(after.match(new RegExp(GENERIC_LINKED_STARTER_COPY, "g")) ?? [])
				.length -
			(after.match(/"content":""/g) ?? []).length;

		const nextFile = `import type { RawCourse } from "./types";

export const ${exportMatch[1]}: RawCourse = ${JSON.stringify(rawCourse, null, "\t")};
`;

		const formattedFile = await prettier.format(nextFile, {
			...((await prettier.resolveConfig(filePath)) ?? {}),
			filepath: filePath
		});

		await fs.writeFile(filePath, formattedFile, "utf8");
		writtenFiles.add(fileName);
	}

	console.log(
		`Repaired generated course copy in ${writtenFiles.size} files (${repairedItems} detected generic/blank bodies).`
	);
}

await main();
