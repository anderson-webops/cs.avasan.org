import type { RequestHandler } from "express";

interface StudentDataWriteState {
	activeLeases: number;
	closed: boolean;
	waiters: Set<() => void>;
}

const STUDENT_DATA_WRITE_LEASE = Symbol("cs.avasan.org.student-data-write-lease");
const writeStates = new Map<string, StudentDataWriteState>();

function stateFor(studentID: string): StudentDataWriteState {
	const current = writeStates.get(studentID);
	if (current) return current;

	const created = {
		activeLeases: 0,
		closed: false,
		waiters: new Set<() => void>()
	};
	writeStates.set(studentID, created);
	return created;
}

export function acquireStudentDataWriteLease(studentID: string): (() => void) | null {
	const state = stateFor(studentID);
	if (state.closed) return null;

	state.activeLeases += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		state.activeLeases = Math.max(0, state.activeLeases - 1);
		if (state.activeLeases === 0) {
			for (const resolve of state.waiters) resolve();
			state.waiters.clear();
			if (!state.closed && writeStates.get(studentID) === state) {
				writeStates.delete(studentID);
			}
		}
	};
}

/**
 * Permanently close this process's student-record write gate and wait for every
 * request that entered before the close to finish. The tombstone remains until
 * process exit so a request that passed authentication before deletion cannot
 * arrive late and recreate a project or review after the deletion sweep.
 */
export async function closeStudentDataWritesAndWait(studentID: string): Promise<void> {
	const state = stateFor(studentID);
	state.closed = true;
	if (state.activeLeases === 0) return;

	await new Promise<void>((resolve) => {
		state.waiters.add(resolve);
	});
}

function studentIDForWriteRequest(req: Parameters<RequestHandler>[0]): string | null {
	const authenticatedStudentID = req.currentStudent?._id?.toString();
	if (authenticatedStudentID) return authenticatedStudentID.toLowerCase();

	const parameter = req.params.studentID;
	const studentID = Array.isArray(parameter) ? parameter[0] : parameter;
	return typeof studentID === "string" && studentID ? studentID.toLowerCase() : null;
}

/**
 * Hold a write lease until Express finishes or closes the response. Deletion
 * closes the gate before its collection sweeps, then waits for these leases.
 */
export const requireStudentDataWriteLease: RequestHandler = (req, res, next) => {
	const leasedRequest = req as typeof req & {
		[STUDENT_DATA_WRITE_LEASE]?: true;
	};
	if (leasedRequest[STUDENT_DATA_WRITE_LEASE]) {
		next();
		return;
	}

	const studentID = studentIDForWriteRequest(req);
	if (!studentID) {
		res.status(403).json({ message: "Student context required." });
		return;
	}

	const release = acquireStudentDataWriteLease(studentID);
	if (!release) {
		res.status(409).json({
			message: "Student records are being permanently deleted."
		});
		return;
	}

	leasedRequest[STUDENT_DATA_WRITE_LEASE] = true;
	const releaseOnce = () => {
		res.off("finish", releaseOnce);
		res.off("close", releaseOnce);
		release();
	};
	res.once("finish", releaseOnce);
	res.once("close", releaseOnce);
	next();
};

export function resetStudentDataWriteBarriersForTests(): void {
	for (const state of writeStates.values()) {
		for (const resolve of state.waiters) resolve();
	}
	writeStates.clear();
}
