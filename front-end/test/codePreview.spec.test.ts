import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CodePreview from "@/components/CodePreview.vue";
import {
	githubRawUrl,
	listPreviewFiles,
	loadPreviewFile,
	parseGitHubResource,
	resetCodePreviewCaches
} from "@/modules/codePreview";

function jsonResponse(body: unknown) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "content-type": "application/json" }
	});
}

function textResponse(body: string) {
	return new Response(body, {
		status: 200,
		headers: { "content-type": "text/plain" }
	});
}

describe("code preview GitHub helpers", () => {
	beforeEach(() => {
		resetCodePreviewCaches();
	});

	afterEach(() => {
		resetCodePreviewCaches();
		vi.restoreAllMocks();
	});

	it("parses GitHub blob links and creates raw file URLs", () => {
		const resource = parseGitHubResource(
			"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java"
		);

		expect(resource).toMatchObject({
			mode: "blob",
			owner: "instruction-material",
			repo: "APCS",
			ref: "main",
			path: "APCS1-Mad-Libs/starter/Main.java"
		});
		expect(resource && githubRawUrl(resource)).toBe(
			"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java"
		);
	});

	it("lists likely code files from folder links and caches directory/file fetches", async () => {
		const fetcher = vi.fn(async (url: string | URL | Request) => {
			const requestUrl = String(url);

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java",
						name: "Main.java",
						path: "APCS1-Mad-Libs/starter/Main.java",
						size: 42,
						type: "file"
					},
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/package-lock.json",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/package-lock.json",
						name: "package-lock.json",
						path: "APCS1-Mad-Libs/starter/package-lock.json",
						size: 40,
						type: "file"
					},
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/logo.png",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/logo.png",
						name: "logo.png",
						path: "APCS1-Mad-Libs/starter/logo.png",
						size: 30,
						type: "file"
					},
					{
						download_url: null,
						html_url:
							"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter/src",
						name: "src",
						path: "APCS1-Mad-Libs/starter/src",
						size: 0,
						type: "dir"
					}
				]);
			}

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter/src?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/src/Helper.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/src/Helper.java",
						name: "Helper.java",
						path: "APCS1-Mad-Libs/starter/src/Helper.java",
						size: 36,
						type: "file"
					}
				]);
			}

			if (requestUrl.endsWith("/Main.java")) {
				return textResponse("public class Main {}");
			}

			return new Response("missing", { status: 404 });
		}) as typeof fetch;

		const files = await listPreviewFiles(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
			fetcher
		);
		const cachedFiles = await listPreviewFiles(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
			fetcher
		);

		expect(files.map(file => file.path)).toEqual([
			"APCS1-Mad-Libs/starter/Main.java",
			"APCS1-Mad-Libs/starter/src/Helper.java"
		]);
		expect(cachedFiles).toBe(files);
		expect(fetcher).toHaveBeenCalledTimes(2);

		const preview = await loadPreviewFile(files[0]!, fetcher);
		const cachedPreview = await loadPreviewFile(files[0]!, fetcher);

		expect(preview.content).toBe("public class Main {}");
		expect(cachedPreview).toBe(preview);
		expect(fetcher).toHaveBeenCalledTimes(3);
	});
});

describe("CodePreview.vue", () => {
	beforeEach(() => {
		resetCodePreviewCaches();
	});

	afterEach(() => {
		resetCodePreviewCaches();
		vi.unstubAllGlobals();
	});

	it("loads an escaped read-only preview only after the user opens it", async () => {
		const fetchMock = vi.fn(async (url: string | URL | Request) => {
			const requestUrl = String(url);

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java",
						name: "Main.java",
						path: "APCS1-Mad-Libs/starter/Main.java",
						size: 52,
						type: "file"
					}
				]);
			}

			if (requestUrl.endsWith("/Main.java")) {
				return textResponse("<script>alert('xss')</script>");
			}

			return new Response("missing", { status: 404 });
		});
		vi.stubGlobal("fetch", fetchMock);

		const wrapper = mount(CodePreview, {
			props: {
				resources: [
					{
						host: "github.com",
						kind: "project",
						label: "Starter project",
						url: "https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter"
					}
				]
			}
		});

		expect(wrapper.text()).toContain("Preview starter code");
		expect(fetchMock).not.toHaveBeenCalled();

		await wrapper.find("button").trigger("click");
		await flushPromises();

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(wrapper.text()).toContain("<script>alert('xss')</script>");
		expect(wrapper.find("script").exists()).toBe(false);
		expect(wrapper.find(".code-preview-open-link").text()).toContain(
			"Open on GitHub"
		);
	});
});
