import {
	clearLocalPythonIdeEditorState,
	syncStoredStudentPythonProjects,
	volatileStudentPythonProjectRecovery
} from "@/modules/pythonIde";

export const studentSessionHandoffErrorMessage =
	"We couldn’t safely finish saving and remove this student’s project copy from this device. The student is still signed in. Open the Python workspace and try again.";

export class StudentSessionHandoffError extends Error {
	constructor(options?: { cause?: unknown }) {
		super(studentSessionHandoffErrorMessage, options);
		this.name = "StudentSessionHandoffError";
	}
}

export type StudentSessionHandoffMode =
	"prepare" | "resume" | "session-ended" | "suspend";

export interface StudentSessionHandoffContext {
	mode: StudentSessionHandoffMode;
	studentID: string;
}

export type StudentSessionHandoffHandler = (
	context: StudentSessionHandoffContext
) => Promise<void> | void;

const studentSessionHandoffHandlers = new Set<StudentSessionHandoffHandler>();

export function registerStudentSessionHandoff(
	handler: StudentSessionHandoffHandler
) {
	studentSessionHandoffHandlers.add(handler);
	return () => studentSessionHandoffHandlers.delete(handler);
}

async function runStudentSessionHandoffHandlers(
	context: StudentSessionHandoffContext
) {
	for (const handler of studentSessionHandoffHandlers) {
		await handler(context);
	}
}

function asStudentSessionHandoffError(error: unknown) {
	return error instanceof StudentSessionHandoffError
		? error
		: new StudentSessionHandoffError({ cause: error });
}

export async function prepareStudentSessionHandoff(studentID: string) {
	try {
		await runStudentSessionHandoffHandlers({
			mode: "prepare",
			studentID
		});
		if (volatileStudentPythonProjectRecovery.hasUnsynced(studentID)) {
			throw new Error("Unsynced project work is still in memory.");
		}

		// Authenticated projects are server-authoritative. When the IDE is not
		// mounted, still remove any legacy owner-keyed browser records before
		// completing the shared-device handoff.
		await syncStoredStudentPythonProjects(studentID);
		clearLocalPythonIdeEditorState(studentID);
	} catch (error) {
		await runStudentSessionHandoffHandlers({
			mode: "resume",
			studentID
		}).catch(() => undefined);
		throw asStudentSessionHandoffError(error);
	}
}

export async function resumeStudentSessionHandoff(studentID: string) {
	await runStudentSessionHandoffHandlers({
		mode: "resume",
		studentID
	});
}

export async function endStudentSessionHandoff(studentID: string) {
	volatileStudentPythonProjectRecovery.discard(studentID);
	try {
		await runStudentSessionHandoffHandlers({
			mode: "session-ended",
			studentID
		});
	} catch (error) {
		throw asStudentSessionHandoffError(error);
	}
}

export async function suspendStudentSessionHandoff(studentID: string) {
	try {
		await runStudentSessionHandoffHandlers({
			mode: "suspend",
			studentID
		});
	} catch (error) {
		throw asStudentSessionHandoffError(error);
	}
}

export function isStudentSessionHandoffError(
	error: unknown
): error is StudentSessionHandoffError {
	return error instanceof StudentSessionHandoffError;
}
