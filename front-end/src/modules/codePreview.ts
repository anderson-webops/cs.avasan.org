export interface CodePreviewResource {
	kind: "project" | "solution";
	label: string;
	url: string;
	host?: string;
}

export interface GitHubResource {
	mode: "blob" | "tree";
	owner: string;
	repo: string;
	ref: string;
	path: string;
	htmlUrl: string;
}

export interface PreviewFile {
	htmlUrl: string;
	label: string;
	path: string;
	rawUrl: string;
	size: number | null;
}

export interface PreviewFileContent {
	content: string;
	file: PreviewFile;
	truncated: boolean;
}

interface GitHubContentItem {
	download_url: string | null;
	html_url: string;
	name: string;
	path: string;
	size: number;
	type: "file" | "dir" | string;
}

type PreviewFetch = typeof fetch;

const GITHUB_HOST_RE = /^(?:www\.)?github\.com$/i;
const GITHUB_RAW_HOST = "raw.githubusercontent.com";
const GITHUB_API_HOST = "api.github.com";
const MAX_FILE_BYTES = 120_000;
const MAX_PREVIEW_CHARS = 80_000;
const MAX_DIRECTORY_DEPTH = 3;
const MAX_DIRECTORY_FILES = 80;
const MAX_LABEL_LENGTH = 72;

const CODE_EXTENSIONS = new Set([
	".asm",
	".c",
	".cc",
	".cpp",
	".cs",
	".css",
	".csv",
	".go",
	".h",
	".hpp",
	".html",
	".java",
	".js",
	".json",
	".jsx",
	".kt",
	".lua",
	".m",
	".md",
	".php",
	".pl",
	".ps1",
	".py",
	".r",
	".rb",
	".rs",
	".s",
	".scala",
	".scss",
	".sh",
	".sql",
	".swift",
	".toml",
	".ts",
	".tsx",
	".txt",
	".vue",
	".xml",
	".yaml",
	".yml"
]);

const CODE_FILE_NAMES = new Set([
	"dockerfile",
	"gemfile",
	"makefile",
	"readme",
	"readme.md",
	"requirements.txt"
]);

const IGNORED_DIRECTORY_NAMES = new Set([
	".git",
	".idea",
	".venv",
	"__pycache__",
	"build",
	"dist",
	"node_modules",
	"out",
	"target",
	"vendor"
]);

const IGNORED_FILE_NAMES = new Set([
	"package-lock.json",
	"pnpm-lock.yaml",
	"poetry.lock",
	"yarn.lock"
]);

const BINARY_EXTENSION_RE =
	/\.(?:7z|a|avi|bmp|class|dll|dmg|docx?|dylib|eot|exe|gif|gz|ico|jar|jpeg|jpg|mov|mp3|mp4|o|otf|pdf|png|pptx?|rar|so|sqlite|tar|tgz|ttf|wasm|wav|webm|webp|woff2?|xlsx?|zip)$/i;

const directoryCache = new Map<string, Promise<PreviewFile[]>>();
const fileCache = new Map<string, Promise<PreviewFileContent>>();

function safeDecode(value: string) {
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function encodePath(path: string) {
	return path
		.split("/")
		.filter(Boolean)
		.map(part => encodeURIComponent(part))
		.join("/");
}

function extensionFor(path: string) {
	const normalizedPath = path.toLowerCase();
	const dotIndex = normalizedPath.lastIndexOf(".");
	return dotIndex >= 0 ? normalizedPath.slice(dotIndex) : "";
}

function baseName(path: string) {
	const parts = path.split("/").filter(Boolean);
	return parts.at(-1) ?? path;
}

function labelFor(path: string) {
	const label = path.replace(/^\/+/, "");
	if (label.length <= MAX_LABEL_LENGTH) return label;

	return `...${label.slice(-(MAX_LABEL_LENGTH - 3))}`;
}

function isLikelyBinaryPath(path: string) {
	return BINARY_EXTENSION_RE.test(path);
}

function isIgnoredFile(path: string) {
	return IGNORED_FILE_NAMES.has(baseName(path).toLowerCase());
}

function isPreviewableCodePath(path: string) {
	const name = baseName(path).toLowerCase();
	if (!name || isLikelyBinaryPath(path) || isIgnoredFile(path)) return false;
	if (CODE_FILE_NAMES.has(name)) return true;

	return CODE_EXTENSIONS.has(extensionFor(name));
}

function scorePreviewFile(file: PreviewFile) {
	const name = baseName(file.path).toLowerCase();
	const path = file.path.toLowerCase();

	if (
		/^(?:main|app|index)\.(?:java|py|js|ts|tsx|jsx|cpp|c|cs|swift|rs|go)$/i.test(
			name
		)
	) {
		return 0;
	}
	if (/starter|template|todo|exercise|project/.test(path)) return 1;
	if (name === "readme.md" || name === "readme") return 2;
	if (/\.(?:java|py|cpp|c|js|ts|vue|html|css)$/i.test(name)) return 3;
	if (file.size !== null && file.size > MAX_FILE_BYTES) return 9;

	return 5;
}

function contentLooksBinary(content: string) {
	return content.includes("\u0000");
}

export function resetCodePreviewCaches() {
	directoryCache.clear();
	fileCache.clear();
}

export function parseGitHubResource(url: string): GitHubResource | null {
	try {
		const parsedUrl = new URL(url);
		if (!GITHUB_HOST_RE.test(parsedUrl.hostname)) return null;

		const segments = parsedUrl.pathname
			.split("/")
			.filter(Boolean)
			.map(safeDecode);
		const [owner, repo, mode, ref, ...pathParts] = segments;

		if (!owner || !repo || !ref) return null;
		if (mode !== "blob" && mode !== "tree") return null;

		return {
			mode,
			owner,
			repo,
			ref,
			path: pathParts.join("/"),
			htmlUrl: parsedUrl.toString()
		};
	} catch {
		return null;
	}
}

export function canPreviewGitHubResource(url: string) {
	return parseGitHubResource(url) !== null;
}

export function githubRawUrl(resource: GitHubResource, path = resource.path) {
	return `https://${GITHUB_RAW_HOST}/${resource.owner}/${resource.repo}/${encodeURIComponent(resource.ref)}/${encodePath(path)}`;
}

export function githubContentsApiUrl(
	resource: GitHubResource,
	path = resource.path
) {
	const encodedPath = encodePath(path);
	const contentsPath = encodedPath ? `/contents/${encodedPath}` : "/contents";
	return `https://${GITHUB_API_HOST}/repos/${resource.owner}/${resource.repo}${contentsPath}?ref=${encodeURIComponent(resource.ref)}`;
}

export function previewActionLabel(resource: CodePreviewResource) {
	if (resource.kind === "solution") return "Preview solution code";
	if (/starter/i.test(`${resource.label} ${resource.url}`)) {
		return "Preview starter code";
	}

	return "Preview project code";
}

export function previewableResources(resources: CodePreviewResource[]) {
	return resources.filter(resource => canPreviewGitHubResource(resource.url));
}

function fileFromBlobResource(resource: GitHubResource): PreviewFile | null {
	if (!isPreviewableCodePath(resource.path)) return null;

	return {
		htmlUrl: resource.htmlUrl,
		label: labelFor(resource.path),
		path: resource.path,
		rawUrl: githubRawUrl(resource),
		size: null
	};
}

function fileFromContentsItem(
	resource: GitHubResource,
	item: GitHubContentItem
): PreviewFile | null {
	if (item.type !== "file") return null;
	if (!isPreviewableCodePath(item.path)) return null;
	if (item.size > MAX_FILE_BYTES) return null;

	return {
		htmlUrl: item.html_url,
		label: labelFor(item.path),
		path: item.path,
		rawUrl: item.download_url ?? githubRawUrl(resource, item.path),
		size: item.size
	};
}

async function fetchJson<T>(fetcher: PreviewFetch, url: string): Promise<T> {
	const response = await fetcher(url);
	if (!response.ok) {
		throw new Error(`GitHub returned ${response.status}.`);
	}

	return (await response.json()) as T;
}

async function listDirectoryFiles(
	resource: GitHubResource,
	path: string,
	fetcher: PreviewFetch,
	depth = 0,
	collected: PreviewFile[] = []
) {
	if (
		depth > MAX_DIRECTORY_DEPTH ||
		collected.length >= MAX_DIRECTORY_FILES
	) {
		return collected;
	}

	const apiUrl = githubContentsApiUrl(resource, path);
	const response = await fetchJson<GitHubContentItem | GitHubContentItem[]>(
		fetcher,
		apiUrl
	);
	const items = Array.isArray(response) ? response : [response];

	for (const item of items) {
		if (collected.length >= MAX_DIRECTORY_FILES) break;

		if (item.type === "file") {
			const file = fileFromContentsItem(resource, item);
			if (file) collected.push(file);
			continue;
		}

		if (
			item.type === "dir" &&
			depth < MAX_DIRECTORY_DEPTH &&
			!IGNORED_DIRECTORY_NAMES.has(item.name.toLowerCase())
		) {
			await listDirectoryFiles(
				resource,
				item.path,
				fetcher,
				depth + 1,
				collected
			);
		}
	}

	return collected;
}

async function listFilesWithoutCache(url: string, fetcher: PreviewFetch) {
	const resource = parseGitHubResource(url);
	if (!resource) {
		throw new Error(
			"Only public GitHub file and folder links can be previewed."
		);
	}

	if (resource.mode === "blob") {
		const file = fileFromBlobResource(resource);
		return file ? [file] : [];
	}

	const files = await listDirectoryFiles(resource, resource.path, fetcher);
	return files
		.sort(
			(a, b) =>
				scorePreviewFile(a) - scorePreviewFile(b) ||
				a.path.localeCompare(b.path)
		)
		.slice(0, MAX_DIRECTORY_FILES);
}

export function listPreviewFiles(url: string, fetcher: PreviewFetch = fetch) {
	const cacheKey = url;
	const cached = directoryCache.get(cacheKey);
	if (cached) return cached;

	const pending = listFilesWithoutCache(url, fetcher).catch(error => {
		if (directoryCache.get(cacheKey) === pending) {
			directoryCache.delete(cacheKey);
		}
		throw error;
	});
	directoryCache.set(cacheKey, pending);
	return pending;
}

async function loadFileWithoutCache(
	file: PreviewFile,
	fetcher: PreviewFetch
): Promise<PreviewFileContent> {
	if (file.size !== null && file.size > MAX_FILE_BYTES) {
		throw new Error("This file is too large to preview.");
	}

	const response = await fetcher(file.rawUrl);
	if (!response.ok) {
		throw new Error(`GitHub returned ${response.status}.`);
	}

	const contentLength = Number(response.headers.get("content-length") ?? 0);
	if (contentLength > MAX_FILE_BYTES) {
		throw new Error("This file is too large to preview.");
	}

	const rawContent = await response.text();
	if (contentLooksBinary(rawContent)) {
		throw new Error(
			"This file appears to be binary and cannot be previewed."
		);
	}

	return {
		content:
			rawContent.length > MAX_PREVIEW_CHARS
				? rawContent.slice(0, MAX_PREVIEW_CHARS)
				: rawContent,
		file,
		truncated: rawContent.length > MAX_PREVIEW_CHARS
	};
}

export function loadPreviewFile(
	file: PreviewFile,
	fetcher: PreviewFetch = fetch
) {
	const cacheKey = file.rawUrl;
	const cached = fileCache.get(cacheKey);
	if (cached) return cached;

	const pending = loadFileWithoutCache(file, fetcher).catch(error => {
		if (fileCache.get(cacheKey) === pending) {
			fileCache.delete(cacheKey);
		}
		throw error;
	});
	fileCache.set(cacheKey, pending);
	return pending;
}
