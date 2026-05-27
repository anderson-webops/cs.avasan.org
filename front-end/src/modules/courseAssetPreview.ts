export interface CourseAssetResource {
	host?: string;
	kind: string;
	label: string;
	url: string;
}

export interface ParsedCourseAssetUrl {
	hash: string;
	path: string;
}

export interface CourseAssetSection {
	content: string;
	hash: string;
	path: string;
	title: string;
}

type CourseAssetFetch = typeof fetch;

const COURSE_ASSET_MARKDOWN_RE = /^\/course-assets\/.+\.md(?:#.+)?$/i;
const assetCache = new Map<string, Promise<string>>();

function cleanHeadingText(value: string) {
	return value
		.replace(/`([^`]+)`/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/[*_~]/g, "")
		.trim();
}

function parseMarkdownHeading(line: string) {
	const trimmed = line.trim();
	let level = 0;

	while (level < trimmed.length && trimmed[level] === "#") {
		level += 1;
	}

	if (level < 1 || level > 6 || trimmed[level] !== " ") return null;

	let title = trimmed.slice(level + 1).trim();
	while (title.endsWith("#")) {
		title = title.slice(0, -1).trimEnd();
	}

	if (!title) return null;

	return { level, title };
}

export function slugMarkdownHeading(value: string) {
	return cleanHeadingText(value)
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, "")
		.trim()
		.replace(/\s+/g, "-");
}

export function parseCourseAssetUrl(url: string): ParsedCourseAssetUrl | null {
	if (!COURSE_ASSET_MARKDOWN_RE.test(url)) return null;

	const [path, hash = ""] = url.split("#", 2);
	return {
		hash: hash.trim(),
		path
	};
}

export function isPreviewableCourseAsset(url: string) {
	return parseCourseAssetUrl(url) !== null;
}

export function previewableCourseAssetResources(
	resources: CourseAssetResource[]
) {
	return resources.filter(resource => isPreviewableCourseAsset(resource.url));
}

export function courseAssetPreviewActionLabel(resource: CourseAssetResource) {
	if (/answer|rubric|key/i.test(resource.label)) {
		return `View ${resource.label}`;
	}

	return `View ${resource.label}`;
}

export function extractMarkdownSection(markdown: string, hash: string) {
	const normalizedHash = hash.replace(/^#/, "").trim();
	if (!normalizedHash) return markdown.trim();

	const lines = markdown.split(/\r?\n/);
	let startIndex = -1;
	let startLevel = 0;

	for (const [index, line] of lines.entries()) {
		const heading = parseMarkdownHeading(line);
		if (!heading) continue;

		if (slugMarkdownHeading(heading.title) !== normalizedHash) continue;

		startIndex = index;
		startLevel = heading.level;
		break;
	}

	if (startIndex < 0) {
		throw new Error("This course asset section could not be found.");
	}

	let endIndex = lines.length;
	for (let index = startIndex + 1; index < lines.length; index += 1) {
		const heading = parseMarkdownHeading(lines[index]);
		if (heading && heading.level <= startLevel) {
			endIndex = index;
			break;
		}
	}

	return lines.slice(startIndex, endIndex).join("\n").trim();
}

export function sectionTitleFromMarkdown(markdown: string, fallback: string) {
	const heading = parseMarkdownHeading(markdown.split(/\r?\n/, 1)[0]);
	if (!heading) return fallback;

	return cleanHeadingText(heading.title);
}

async function loadAssetMarkdown(path: string, fetcher: CourseAssetFetch) {
	const cached = assetCache.get(path);
	if (cached) return cached;

	const pending = fetcher(path).then(async response => {
		if (!response.ok) {
			throw new Error(`Course asset returned ${response.status}.`);
		}

		return response.text();
	});

	assetCache.set(path, pending);
	return pending;
}

export async function loadCourseAssetSection(
	url: string,
	label: string,
	fetcher: CourseAssetFetch = fetch
): Promise<CourseAssetSection> {
	const parsed = parseCourseAssetUrl(url);
	if (!parsed) {
		throw new Error("Only local Markdown course assets can be previewed.");
	}

	const markdown = await loadAssetMarkdown(parsed.path, fetcher);
	const content = extractMarkdownSection(markdown, parsed.hash);

	return {
		content,
		hash: parsed.hash,
		path: parsed.path,
		title: sectionTitleFromMarkdown(content, label)
	};
}

export function resetCourseAssetPreviewCache() {
	assetCache.clear();
}
