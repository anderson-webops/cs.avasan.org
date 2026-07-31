import type { PythonIdeProject } from "@/modules/pythonIde";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { isProxy, reactive } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import {
	applyPythonIdeRecoveryPlan,
	claimAnonymousPythonProjectForStudent,
	createRemotePythonIdeProject,
	deleteRemotePythonIdeProject,
	fetchPythonIdeProject,
	fetchPythonIdeProjects,
	fetchVisiblePythonIdeProjectReview,
	fetchVisiblePythonIdeProjectReviews,
	loadLocalPythonProjects,
	plainPythonIdeProjectsSnapshot,
	reconcilePythonIdeRecoveryProjects,
	removeLocalPythonProjectAsync,
	saveLocalPythonProjectsAsync,
	updateRemotePythonIdeProject
} from "@/modules/pythonIde";

vi.mock("@/api", () => ({
	api: {
		delete: vi.fn(),
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn()
	}
}));

const workspacePath = resolve(
	__dirname,
	"../src/components/PythonIdeWorkspace.vue"
);

function project(
	id: string,
	updatedAt: string,
	content = id
): PythonIdeProject {
	return {
		_id: id,
		title: id,
		mode: "python",
		files: [{ name: "main.py", content }],
		activeFileName: "main.py",
		updatedAt
	};
}

describe("student Python project sync boundaries", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("binds every student project request to the expected student", async () => {
		const remote = project("remote-a", "2026-07-29T12:00:00.000Z");
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { projects: [remote] }
		});
		vi.mocked(api.get).mockResolvedValueOnce({ data: { reviews: [] } });
		vi.mocked(api.get).mockResolvedValueOnce({
			data: { project: remote }
		});
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				review: {
					_id: "review-a",
					sourceProject: remote._id,
					title: remote.title,
					mode: remote.mode,
					files: remote.files,
					activeFileName: remote.activeFileName,
					reviewerRole: "admin",
					visibleToStudent: true
				}
			}
		});
		vi.mocked(api.post).mockResolvedValueOnce({
			data: { project: remote }
		});
		vi.mocked(api.put).mockResolvedValueOnce({ data: { project: remote } });
		vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

		const projectIndex = await fetchPythonIdeProjects("student-a");
		await fetchVisiblePythonIdeProjectReviews("student-a");
		const projectDetail = await fetchPythonIdeProject(
			remote._id,
			"student-a"
		);
		await fetchVisiblePythonIdeProjectReview("review-a", "student-a");
		await createRemotePythonIdeProject({ title: "Imported" }, "student-a", {
			importID: "local-import-a"
		});
		await updateRemotePythonIdeProject(
			remote._id,
			{ title: "Changed" },
			"student-a",
			{ expectedUpdatedAt: remote.updatedAt }
		);
		await deleteRemotePythonIdeProject(remote._id, "student-a", {
			expectedUpdatedAt: remote.updatedAt!
		});

		const headers = { headers: { "X-Student-ID": "student-a" } };
		expect(projectIndex[0]).toMatchObject({
			_id: remote._id,
			files: [],
			remoteContentLoaded: false
		});
		expect(projectDetail).toMatchObject({
			_id: remote._id,
			files: remote.files,
			remoteContentLoaded: true
		});
		expect(api.get).toHaveBeenNthCalledWith(1, "/students/projects", {
			...headers,
			params: { page: 1, pageSize: 10 }
		});
		expect(api.get).toHaveBeenNthCalledWith(
			2,
			"/students/project-reviews",
			{
				...headers,
				params: { page: 1, pageSize: 10 }
			}
		);
		expect(api.get).toHaveBeenNthCalledWith(
			3,
			`/students/projects/${remote._id}`,
			headers
		);
		expect(api.get).toHaveBeenNthCalledWith(
			4,
			"/students/project-reviews/review-a",
			headers
		);
		expect(api.post).toHaveBeenCalledWith(
			"/students/projects",
			{ title: "Imported", importID: "local-import-a" },
			headers
		);
		expect(api.put).toHaveBeenCalledWith(
			`/students/projects/${remote._id}`,
			{
				title: "Changed",
				expectedUpdatedAt: remote.updatedAt
			},
			headers
		);
		expect(api.delete).toHaveBeenCalledWith(
			`/students/projects/${remote._id}`,
			{
				data: { expectedUpdatedAt: remote.updatedAt },
				headers: { "X-Student-ID": "student-a" }
			}
		);
	});

	it("confirms a lost successful delete only when the project is absent", async () => {
		const responseLost = new Error("connection reset after delete");
		vi.mocked(api.delete).mockRejectedValueOnce(responseLost);
		vi.mocked(api.get).mockResolvedValueOnce({ data: { projects: [] } });

		await expect(
			deleteRemotePythonIdeProject("project-a", "student-a", {
				expectedUpdatedAt: "2026-07-29T12:00:00.000Z"
			})
		).resolves.toBeUndefined();

		expect(api.get).toHaveBeenCalledWith("/students/projects", {
			headers: { "X-Student-ID": "student-a" },
			params: { page: 1, pageSize: 10 }
		});
	});

	it("keeps an interrupted delete visible when recovery is inconclusive", async () => {
		const responseLost = new Error("connection reset after delete");
		vi.mocked(api.delete).mockRejectedValueOnce(responseLost);
		vi.mocked(api.get).mockResolvedValueOnce({
			data: {
				projects: [project("project-a", "2026-07-29T12:00:00.000Z")]
			}
		});

		await expect(
			deleteRemotePythonIdeProject("project-a", "student-a", {
				expectedUpdatedAt: "2026-07-29T12:00:00.000Z"
			})
		).rejects.toBe(responseLost);
	});

	it("does not probe a definitive delete rejection", async () => {
		const conflict = { response: { status: 409 } };
		vi.mocked(api.delete).mockRejectedValueOnce(conflict);

		await expect(
			deleteRemotePythonIdeProject("project-a", "student-a", {
				expectedUpdatedAt: "2026-07-29T12:00:00.000Z"
			})
		).rejects.toBe(conflict);
		expect(api.get).not.toHaveBeenCalled();
	});

	it("reconciles by content and confirmed baselines instead of client clocks", () => {
		const remoteSame = {
			...project("shared-a", "2026-07-29T12:00:00.000Z", "same content"),
			serverUpdatedAt: "2026-07-29T12:00:00.000Z"
		};
		const localSame = {
			...project("shared-a", "2026-07-29T11:00:00.000Z", "same content"),
			serverUpdatedAt: "2026-07-29T10:00:00.000Z"
		};
		const remoteBaseline = {
			...project("shared-b", "2026-07-29T10:00:00.000Z", "remote older"),
			serverUpdatedAt: "2026-07-29T10:00:00.000Z"
		};
		const localBasedOnRemote = {
			...project("shared-b", "2026-07-29T09:00:00.000Z", "local edit"),
			serverUpdatedAt: remoteBaseline.serverUpdatedAt
		};
		const localNew = project(
			"local-new-project",
			"2026-07-29T13:30:00.000Z"
		);
		const remoteOnly = project("remote-only", "2026-07-29T09:00:00.000Z");

		const plan = reconcilePythonIdeRecoveryProjects(
			[localSame, localBasedOnRemote, localNew],
			[remoteSame, remoteBaseline, remoteOnly]
		);

		expect(
			plan.projects.find(candidate => candidate._id === "shared-a")
				?.files[0]?.content
		).toBe("same content");
		expect(
			plan.projects.find(candidate => candidate._id === "shared-b")
				?.files[0]?.content
		).toBe("local edit");
		expect(
			plan.projects.some(candidate => candidate._id === "remote-only")
		).toBe(true);
		expect(plan.writes).toEqual([
			expect.objectContaining({
				kind: "update",
				expectedUpdatedAt: remoteBaseline.serverUpdatedAt,
				project: expect.objectContaining({ _id: "shared-b" })
			}),
			expect.objectContaining({
				kind: "create",
				importID: "local-new-project",
				project: expect.objectContaining({ _id: "local-new-project" })
			})
		]);
	});

	it("preserves a post-response local edit after a lost PUT as a recovered copy", () => {
		const remoteVersionTwo = {
			...project(
				"shared-lost-put",
				"2026-07-29T12:00:00.000Z",
				"server version two"
			),
			createdAt: "2026-07-29T10:00:00.000Z",
			serverUpdatedAt: "2026-07-29T12:00:00.000Z"
		};
		const localVersionThree = {
			...project(
				"shared-lost-put",
				"2026-07-29T13:00:00.000Z",
				"local version three"
			),
			serverUpdatedAt: "2026-07-29T11:00:00.000Z"
		};

		const plan = reconcilePythonIdeRecoveryProjects(
			[localVersionThree],
			[remoteVersionTwo]
		);
		const recoveredProject = plan.projects.find(project =>
			project._id.startsWith("local-shared-lost-put:recovered:")
		);

		expect(
			plan.projects.find(project => project._id === "shared-lost-put")
				?.files[0]?.content
		).toBe("server version two");
		expect(recoveredProject?.files[0]?.content).toBe("local version three");
		expect(recoveredProject?.title).toBe("shared-lost-put (recovered)");
		expect(plan.writes).toEqual([
			expect.objectContaining({
				importID: expect.stringContaining("shared-lost-put:recovered:"),
				kind: "create",
				project: expect.objectContaining({
					files: [
						expect.objectContaining({
							content: "local version three"
						})
					]
				})
			})
		]);
		const recoveredWrite = plan.writes.find(
			write => write.kind === "create"
		);
		if (!recoveredWrite || recoveredWrite.kind !== "create") {
			throw new Error("Expected a recovered create write");
		}
		const retryPlan = reconcilePythonIdeRecoveryProjects(plan.projects, [
			remoteVersionTwo
		]);
		const retriedRecoveredWrite = retryPlan.writes.find(
			write =>
				write.kind === "create" &&
				write.project._id === recoveredWrite.project._id
		);
		expect(retriedRecoveredWrite).toMatchObject({
			importID: recoveredWrite.importID,
			kind: "create"
		});
	});

	it("keeps a confirmed delete deleted but recovers edits made after it", () => {
		const unchangedDeletedProject = {
			...project(
				"deleted-project",
				"2026-07-29T12:00:00.000Z",
				"server version"
			),
			serverUpdatedAt: "2026-07-29T12:00:00.000Z"
		};
		const unchangedPlan = reconcilePythonIdeRecoveryProjects(
			[unchangedDeletedProject],
			[]
		);
		expect(unchangedPlan.projects).toEqual([]);
		expect(unchangedPlan.writes).toEqual([]);

		const editedAfterDelete = {
			...unchangedDeletedProject,
			files: [
				{ name: "main.py", content: "edit after interrupted delete" }
			],
			updatedAt: "2026-07-29T12:05:00.000Z"
		};
		const recoveryPlan = reconcilePythonIdeRecoveryProjects(
			[editedAfterDelete],
			[]
		);
		expect(recoveryPlan.writes).toEqual([
			expect.objectContaining({
				kind: "create",
				project: expect.objectContaining({
					title: "deleted-project (recovered)"
				})
			})
		]);
	});

	it("deduplicates an acknowledged idempotent create retry", async () => {
		const localProject = project("local-retry", "2026-07-29T13:00:00.000Z");
		const existingRemote = {
			...localProject,
			_id: "remote-retry",
			createdAt: "2026-07-29T13:01:00.000Z",
			importID: "local-retry",
			serverUpdatedAt: "2026-07-29T13:01:00.000Z",
			updatedAt: "2026-07-29T13:01:00.000Z"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				idempotentReplay: true,
				project: existingRemote
			}
		});

		const merged = await applyPythonIdeRecoveryPlan(
			{
				projects: [localProject, existingRemote],
				writes: [
					{
						importID: "local-retry",
						kind: "create",
						project: localProject
					}
				]
			},
			"student-a"
		);

		expect(merged).toHaveLength(1);
		expect(merged[0]?._id).toBe("remote-retry");
	});

	it("updates a pristine replay with newer local content after a lost create response", async () => {
		const createdAt = "2026-07-29T13:00:00.000Z";
		const remoteVersionOne = {
			...project("remote-lost-create", createdAt, "version one"),
			createdAt,
			importID: "local-lost-create",
			serverUpdatedAt: createdAt,
			title: "Lost create"
		};
		const updatedRemote = {
			...remoteVersionOne,
			files: [{ name: "main.py", content: "version two" }],
			serverUpdatedAt: "2026-07-29T13:02:00.000Z",
			updatedAt: "2026-07-29T13:02:00.000Z"
		};
		vi.mocked(api.post).mockResolvedValueOnce({
			data: {
				idempotentReplay: true,
				project: remoteVersionOne
			}
		});
		vi.mocked(api.put).mockResolvedValueOnce({
			data: { project: updatedRemote }
		});

		const result = await createRemotePythonIdeProject(
			{
				activeFileName: "main.py",
				files: [{ name: "main.py", content: "version two" }],
				mode: "python",
				title: "Lost create"
			},
			"student-a",
			{
				importID: "local-lost-create",
				localUpdatedAt: "2026-07-29T13:01:00.000Z"
			}
		);

		expect(result.files[0]?.content).toBe("version two");
		expect(api.put).toHaveBeenCalledWith(
			"/students/projects/remote-lost-create",
			expect.objectContaining({
				expectedUpdatedAt: createdAt,
				files: [expect.objectContaining({ content: "version two" })]
			}),
			{ headers: { "X-Student-ID": "student-a" } }
		);
		expect(api.post).toHaveBeenCalledTimes(1);
	});

	it("forks local content when an idempotent create target already changed", async () => {
		const remoteChanged = {
			...project(
				"remote-changed-create",
				"2026-07-29T13:02:00.000Z",
				"server edit"
			),
			createdAt: "2026-07-29T13:00:00.000Z",
			importID: "local-changed-create",
			serverUpdatedAt: "2026-07-29T13:02:00.000Z",
			title: "Changed create"
		};
		vi.mocked(api.post)
			.mockResolvedValueOnce({
				data: {
					idempotentReplay: true,
					project: remoteChanged
				}
			})
			.mockImplementationOnce(async (_path, body) => ({
				data: {
					idempotentReplay: false,
					project: {
						...project(
							"remote-recovered-create",
							"2026-07-29T13:04:00.000Z",
							body.files[0].content
						),
						createdAt: "2026-07-29T13:04:00.000Z",
						importID: body.importID,
						serverUpdatedAt: "2026-07-29T13:04:00.000Z",
						title: body.title
					}
				}
			}));

		const result = await createRemotePythonIdeProject(
			{
				activeFileName: "main.py",
				files: [{ name: "main.py", content: "local edit" }],
				mode: "python",
				title: "Changed create"
			},
			"student-a",
			{
				importID: "local-changed-create",
				localUpdatedAt: "2026-07-29T13:03:00.000Z"
			}
		);

		const recoveredBody = vi.mocked(api.post).mock.calls[1]?.[1];
		expect(api.put).not.toHaveBeenCalled();
		expect(recoveredBody.importID).toContain(
			"local-changed-create:recovered:"
		);
		expect(recoveredBody.importID).toMatch(/^[\w.:-]{3,128}$/);
		expect(recoveredBody.title).toBe("Changed create (recovered)");
		expect(recoveredBody.files[0]?.content).toBe("local edit");
		expect(result.files[0]?.content).toBe("local edit");
		expect(result.title).toBe("Changed create (recovered)");
	});

	it("forks local content when a pristine replay changes before its optimistic update", async () => {
		const createdAt = "2026-07-29T13:00:00.000Z";
		const pristineRemote = {
			...project("remote-raced-create", createdAt, "version one"),
			createdAt,
			importID: "local-raced-create",
			serverUpdatedAt: createdAt,
			title: "Raced create"
		};
		vi.mocked(api.post)
			.mockResolvedValueOnce({
				data: {
					idempotentReplay: true,
					project: pristineRemote
				}
			})
			.mockImplementationOnce(async (_path, body) => ({
				data: {
					idempotentReplay: false,
					project: {
						...project(
							"remote-raced-recovery",
							"2026-07-29T13:03:00.000Z",
							body.files[0].content
						),
						createdAt: "2026-07-29T13:03:00.000Z",
						importID: body.importID,
						serverUpdatedAt: "2026-07-29T13:03:00.000Z",
						title: body.title
					}
				}
			}));
		vi.mocked(api.put).mockRejectedValueOnce({
			response: { status: 409 }
		});

		const result = await createRemotePythonIdeProject(
			{
				activeFileName: "main.py",
				files: [{ name: "main.py", content: "local version two" }],
				mode: "python",
				title: "Raced create"
			},
			"student-a",
			{
				importID: "local-raced-create",
				localUpdatedAt: "2026-07-29T13:02:00.000Z"
			}
		);

		expect(api.put).toHaveBeenCalledTimes(1);
		expect(api.post).toHaveBeenCalledTimes(2);
		expect(vi.mocked(api.post).mock.calls[1]?.[1].title).toBe(
			"Raced create (recovered)"
		);
		expect(result.files[0]?.content).toBe("local version two");
	});

	it("converts reactive projects and nested files to plain storage snapshots", () => {
		const reactiveProjects = reactive([
			project("local-reactive", "2026-07-29T12:00:00.000Z")
		]);
		expect(isProxy(reactiveProjects[0])).toBe(true);
		expect(isProxy(reactiveProjects[0]?.files[0])).toBe(true);

		const snapshot = plainPythonIdeProjectsSnapshot(reactiveProjects);

		expect(isProxy(snapshot)).toBe(false);
		expect(isProxy(snapshot[0])).toBe(false);
		expect(isProxy(snapshot[0]?.files[0])).toBe(false);
		expect(snapshot).toEqual(reactiveProjects);
	});

	it("removes only the acknowledged anonymous import from local storage", async () => {
		const storage = new Map<string, string>();
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				getItem: vi.fn((key: string) => storage.get(key) ?? null),
				removeItem: vi.fn((key: string) => storage.delete(key)),
				setItem: vi.fn((key: string, value: string) =>
					storage.set(key, value)
				)
			}
		});
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			value: undefined
		});
		await saveLocalPythonProjectsAsync(
			[
				project(
					"local-imported",
					"2026-07-29T14:20:00.000Z",
					"print('student a')"
				),
				project(
					"local-still-anonymous",
					"2026-07-29T14:21:00.000Z",
					"print('still local')"
				)
			],
			null
		);

		await removeLocalPythonProjectAsync("local-imported", null);

		expect(loadLocalPythonProjects(null).map(saved => saved._id)).toEqual([
			"local-still-anonymous"
		]);
	});

	it("leaves anonymous work intact when its atomic claim fails", async () => {
		const storage = new Map<string, string>();
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				get length() {
					return storage.size;
				},
				getItem: vi.fn((key: string) => storage.get(key) ?? null),
				key: vi.fn(
					(index: number) => [...storage.keys()][index] ?? null
				),
				removeItem: vi.fn((key: string) => storage.delete(key)),
				setItem: vi.fn((key: string, value: string) =>
					storage.set(key, value)
				)
			}
		});
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			value: undefined
		});
		const anonymousProject = project(
			"local-private-import",
			"2026-07-29T14:22:00.000Z",
			"print('private student work')"
		);
		await saveLocalPythonProjectsAsync([anonymousProject], null);

		const database = {
			objectStoreNames: { contains: () => true },
			onversionchange: null,
			close: vi.fn(),
			transaction: vi.fn(
				(_storeName: string, mode: IDBTransactionMode) => {
					const transaction = {
						error: null as Error | null,
						onabort: null as (() => void) | null,
						oncomplete: null as (() => void) | null,
						onerror: null as (() => void) | null,
						abort: vi.fn(),
						objectStore: null as unknown as () => IDBObjectStore
					};
					let putCount = 0;
					const request = <T>(
						result: T,
						completeTransaction = false
					) => {
						const pendingRequest = {
							error: null,
							result,
							onerror: null as (() => void) | null,
							onsuccess: null as (() => void) | null
						};
						window.setTimeout(() => {
							pendingRequest.onsuccess?.();
							if (completeTransaction) {
								window.setTimeout(
									() => transaction.oncomplete?.(),
									0
								);
							}
						}, 0);
						return pendingRequest as unknown as IDBRequest<T>;
					};
					const store = {
						getAll: () => request([], true),
						get: () => request(undefined),
						put: () => {
							putCount += 1;
							if (putCount === 2) {
								window.setTimeout(() => {
									transaction.error = new Error(
										"claim transaction failed"
									);
									transaction.onerror?.();
								}, 0);
							}
							return {} as IDBRequest;
						}
					};
					transaction.objectStore = () =>
						store as unknown as IDBObjectStore;
					if (mode === "readonly") putCount = -100;
					return transaction as unknown as IDBTransaction;
				}
			)
		};
		const openRequest = {
			error: null,
			result: database,
			onblocked: null as (() => void) | null,
			onerror: null as (() => void) | null,
			onsuccess: null as (() => void) | null,
			onupgradeneeded: null as (() => void) | null
		};
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			value: {
				open: vi.fn(() => {
					window.setTimeout(() => openRequest.onsuccess?.(), 0);
					return openRequest;
				})
			}
		});

		await expect(
			claimAnonymousPythonProjectForStudent(anonymousProject)
		).rejects.toThrow("claim transaction failed");

		expect(loadLocalPythonProjects(null)).toEqual([anonymousProject]);
		expect(loadLocalPythonProjects("student-a")).toEqual([]);
	});

	it("hides the previous owner synchronously and requires explicit imports", async () => {
		const source = await readFile(workspacePath, "utf8");
		const hideIndex = source.indexOf(
			"hideWorkspaceForOwnerTransition(previousOwnerID);"
		);
		const queueIndex = source.indexOf(
			"projectOwnerSwitchQueue = projectOwnerSwitchQueue"
		);

		expect(source).toContain("studentRequiresPasswordSetup.value");
		expect(source).toContain("registerStudentSessionHandoff(");
		expect(source).toContain(
			'reportClassroomUsage("ide-open", requestedCourseId.value)'
		);
		expect(hideIndex).toBeGreaterThan(0);
		expect(queueIndex).toBeGreaterThan(hideIndex);
		expect(source).toContain("Only add them if they are yours.");
		expect(source).toContain("Save to my account");
		expect(source).toContain("Keep separate");
		expect(source).toContain("importID: pythonIdeImportID(project)");
		expect(source).toContain(
			"await saveNewProject(initialProject, false, loadRunID)"
		);
		expect(source).toContain("runOwnerBoundMutation(async () =>");
		expect(source).toContain("await waitForOwnerBoundMutations()");
		const transitionSource = source.slice(
			source.indexOf("function hideWorkspaceForOwnerTransition"),
			source.indexOf("async function handleStudentSessionHandoff")
		);
		const projectClearIndex = transitionSource.indexOf(
			"projects.value = [];"
		);
		for (const ownerScrub of [
			"clearOwnerRuntimeArtifactSurfaces();",
			"codeEditorView?.destroy();",
			"codeEditorViewStates.clear();",
			"codeEditorStateSnapshots.clear();",
			"gameImageCache.clear();",
			'inputText.value = "";',
			'newFileName.value = "";',
			"clearOutput();"
		]) {
			expect(transitionSource.indexOf(ownerScrub)).toBeGreaterThanOrEqual(
				0
			);
			expect(transitionSource.indexOf(ownerScrub)).toBeLessThan(
				projectClearIndex
			);
		}
		expect(source).toContain('frame.src = "about:blank";');
		expect(source).toContain("audio.pause();");
		const importSource = source.slice(
			source.indexOf("async function importAnonymousProjects"),
			source.indexOf("function keepAnonymousProjectsSeparate")
		);
		expect(
			importSource.indexOf("await claimAnonymousPythonProjectForStudent(")
		).toBeLessThan(
			importSource.indexOf(
				"const importedProject = await createRemotePythonIdeProject"
			)
		);
		expect(importSource).not.toContain(
			"removeLocalPythonProjectAsync(project._id, null)"
		);
		expect(
			importSource.indexOf("projects.value.unshift(claimedProject)")
		).toBeLessThan(
			importSource.indexOf(
				"const importedProject = await createRemotePythonIdeProject"
			)
		);
		expect(
			importSource.indexOf("unsyncedProjectIDs.add(claimedProject._id)")
		).toBeLessThan(
			importSource.indexOf(
				"const importedProject = await createRemotePythonIdeProject"
			)
		);
		expect(importSource).toContain(
			"This project is only in this open page and is not in the account yet. Keep this page open and try again."
		);
		expect(importSource).not.toContain(
			"anonymousImportError.value =\n\t\t\t\terror instanceof Error"
		);
		const handoffSource = source.slice(
			source.indexOf("async function handleStudentSessionHandoff"),
			source.indexOf("async function switchProjectOwner")
		);
		expect(
			handoffSource.indexOf(
				"volatileStudentPythonProjectRecovery.replace("
			)
		).toBeLessThan(
			handoffSource.indexOf("hideWorkspaceForOwnerTransition(studentID);")
		);
		expect(handoffSource).not.toContain(
			"preserveStudentPythonProjectsForSessionEnd"
		);
		expect(handoffSource).toContain(
			"volatileStudentProjectRecovery.discard(studentID)"
		);
	});

	it("keeps the confirmed cross-tab clear implementation while its panel is hidden", async () => {
		const source = await readFile(workspacePath, "utf8");
		const clearHandler = source.slice(
			source.indexOf(
				"async function resetAnonymousWorkspaceForNextStudent"
			),
			source.indexOf("async function loadProjects")
		);

		expect(source).toContain("Clear browser projects for next student");
		expect(source).toContain("Clear all browser projects");
		expect(source).toContain(
			"const sharedComputerCleanupPanelIsVisible = false;"
		);
		expect(source).toContain(
			'v-if="sharedComputerCleanupPanelIsVisible && !currentStudent"'
		);
		expect(clearHandler).toContain(
			"if (currentStudent.value || activeStorageOwnerID.value) return;"
		);
		expect(clearHandler).toContain(
			"await purgeAnonymousPythonWorkspace({ broadcast });"
		);
		expect(clearHandler).toContain("createPythonIdeProject(");
		expect(source).toContain(
			'window.addEventListener("storage", handleAnonymousWorkspaceClearSignal);'
		);
		expect(source).toContain(
			'window.addEventListener("pageshow", handleAnonymousWorkspacePageShow);'
		);
		expect(source).toContain(
			'window.removeEventListener("storage", handleAnonymousWorkspaceClearSignal);'
		);
	});
});
