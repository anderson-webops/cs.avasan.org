import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	clearLocalPythonIdeEditorState,
	syncStoredStudentPythonProjects,
	volatileStudentPythonProjectRecovery
} from "@/modules/pythonIde";
import {
	prepareStudentSessionHandoff,
	registerStudentSessionHandoff,
	StudentSessionHandoffError,
	studentSessionHandoffErrorMessage,
	suspendStudentSessionHandoff
} from "@/modules/studentSessionHandoff";

vi.mock("@/modules/pythonIde", () => ({
	clearLocalPythonIdeEditorState: vi.fn(),
	syncStoredStudentPythonProjects: vi.fn(),
	volatileStudentPythonProjectRecovery: {
		discard: vi.fn(),
		hasUnsynced: vi.fn(() => false)
	}
}));

describe("student session project handoff", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("flushes the mounted workspace before purging legacy owner storage", async () => {
		const handler = vi.fn().mockResolvedValue(undefined);
		const unregister = registerStudentSessionHandoff(handler);

		await prepareStudentSessionHandoff("student-a");

		expect(handler).toHaveBeenCalledWith({
			mode: "prepare",
			studentID: "student-a"
		});
		expect(syncStoredStudentPythonProjects).toHaveBeenCalledWith(
			"student-a"
		);
		expect(clearLocalPythonIdeEditorState).toHaveBeenCalledWith("student-a");
		expect(handler.mock.invocationCallOrder[0]).toBeLessThan(
			vi.mocked(syncStoredStudentPythonProjects).mock
				.invocationCallOrder[0] ?? Number.POSITIVE_INFINITY
		);
		unregister();
	});

	it("suspends the exact workspace during routine revalidation", async () => {
		const handler = vi.fn().mockResolvedValue(undefined);
		const unregister = registerStudentSessionHandoff(handler);

		await suspendStudentSessionHandoff("student-a");

		expect(handler).toHaveBeenCalledWith({
			mode: "suspend",
			studentID: "student-a"
		});
		expect(
			volatileStudentPythonProjectRecovery.hasUnsynced
		).not.toHaveBeenCalled();
		unregister();
	});

	it("blocks session exit with safe copy when a remote flush fails", async () => {
		const unregister = registerStudentSessionHandoff(async () => {
			throw new Error("database host and private project details");
		});

		await expect(
			prepareStudentSessionHandoff("student-a")
		).rejects.toMatchObject({
			name: "StudentSessionHandoffError",
			message: studentSessionHandoffErrorMessage
		});
		expect(syncStoredStudentPythonProjects).not.toHaveBeenCalled();
		unregister();
	});

	it("blocks sign-out while unmounted work remains unsynced in memory", async () => {
		vi.mocked(
			volatileStudentPythonProjectRecovery.hasUnsynced
		).mockReturnValueOnce(true);

		await expect(
			prepareStudentSessionHandoff("student-a")
		).rejects.toMatchObject({
			name: "StudentSessionHandoffError",
			message: studentSessionHandoffErrorMessage
		});
		expect(syncStoredStudentPythonProjects).not.toHaveBeenCalled();
	});

	it("does not hide a recovery acknowledgement failure and keeps the safe public error", async () => {
		const modes: string[] = [];
		const unregister = registerStudentSessionHandoff(({ mode }) => {
			modes.push(mode);
		});
		vi.mocked(syncStoredStudentPythonProjects).mockRejectedValueOnce(
			new Error("IndexedDB transaction aborted")
		);

		const failure = prepareStudentSessionHandoff("student-a");

		await expect(failure).rejects.toBeInstanceOf(StudentSessionHandoffError);
		await expect(failure).rejects.toThrow(studentSessionHandoffErrorMessage);
		expect(modes).toEqual(["prepare", "resume"]);
		unregister();
	});
});
