import type { RequestHandler } from "express";
import { Student } from "../models/schemas/Student.js";

interface StudentRecordMutationState {
	activeLeases: number;
	preservationHeld: boolean;
	waiters: Set<() => void>;
}

const mutationStates = new Map<string, StudentRecordMutationState>();

export const STUDENT_RECORD_PRESERVATION_MESSAGE
	= "Student records are temporarily read-only for an open inspection or review request. Release the hold only after that request is closed.";

function normalizedStudentID(studentID: string): string {
	return studentID.toLowerCase();
}

function stateFor(studentID: string): StudentRecordMutationState {
	const normalized = normalizedStudentID(studentID);
	const current = mutationStates.get(normalized);
	if (current) return current;

	const created = {
		activeLeases: 0,
		preservationHeld: false,
		waiters: new Set<() => void>()
	};
	mutationStates.set(normalized, created);
	return created;
}

export function acquireStudentRecordMutationLease(
	studentID: string
): (() => void) | null {
	const normalized = normalizedStudentID(studentID);
	const state = stateFor(normalized);
	if (state.preservationHeld) return null;

	state.activeLeases += 1;
	let released = false;
	return () => {
		if (released) return;
		released = true;
		state.activeLeases = Math.max(0, state.activeLeases - 1);
		if (state.activeLeases === 0) {
			for (const resolve of state.waiters) resolve();
			state.waiters.clear();
			if (
				!state.preservationHeld
				&& mutationStates.get(normalized) === state
			) {
				mutationStates.delete(normalized);
			}
		}
	};
}

/**
 * Close the reusable mutation gate before the durable hold is written, then
 * wait for every retained-content, deletion, or alias-correction mutation that
 * entered first. Login, credential, provider, and account-status security
 * operations remain available. Canonical production runs one API process; the
 * database flag is the restart-safe source of truth checked for every later
 * protected mutation.
 */
export async function holdStudentRecordMutationsAndWait(
	studentID: string
): Promise<void> {
	const state = stateFor(studentID);
	state.preservationHeld = true;
	if (state.activeLeases === 0) return;

	await new Promise<void>((resolve) => {
		state.waiters.add(resolve);
	});
}

export function releaseStudentRecordMutationHold(studentID: string): void {
	const normalized = normalizedStudentID(studentID);
	const state = mutationStates.get(normalized);
	if (!state) return;
	state.preservationHeld = false;
	if (state.activeLeases === 0) mutationStates.delete(normalized);
}

/**
 * Acquire the in-process gate and then consult the durable hold. A database
 * failure throws instead of allowing an unverified write.
 */
export async function acquireVerifiedStudentRecordMutationLease(
	studentID: string
): Promise<(() => void) | null> {
	const release = acquireStudentRecordMutationLease(studentID);
	if (!release) return null;

	try {
		const held = await Student.exists({
			_id: studentID,
			recordPreservationHoldActive: true
		});
		if (!held) return release;

		release();
		await holdStudentRecordMutationsAndWait(studentID);
		return null;
	}
	catch (error) {
		release();
		throw error;
	}
}

function studentIDForRequest(
	req: Parameters<RequestHandler>[0]
): string | null {
	const authenticatedStudentID = req.currentStudent?._id?.toString();
	if (authenticatedStudentID) {
		return normalizedStudentID(authenticatedStudentID);
	}

	const parameter = req.params.studentID;
	const studentID = Array.isArray(parameter) ? parameter[0] : parameter;
	return typeof studentID === "string" && studentID
		? normalizedStudentID(studentID)
		: null;
}

/**
 * Wrap a terminal route that can change protected content, the approved alias,
 * or deletion state. A response close does not release the lease while the
 * async controller can still mutate records; only controller settlement does.
 * Authentication and rate limiting belong outside this terminal wrapper.
 */
export function withStudentRecordMutationLease(
	handler: RequestHandler
): RequestHandler {
	return async (req, res, next) => {
		const studentID = studentIDForRequest(req);
		if (!studentID) {
			res.status(403).json({ message: "Student context required." });
			return;
		}

		let release: (() => void) | null;
		try {
			release = await acquireVerifiedStudentRecordMutationLease(studentID);
		}
		catch {
			res.status(503).json({
				message: "Record-preservation status could not be verified."
			});
			return;
		}
		if (!release) {
			res.status(409).json({ message: STUDENT_RECORD_PRESERVATION_MESSAGE });
			return;
		}

		try {
			await handler(req, res, next);
		}
		finally {
			release();
		}
	};
}

export function resetStudentRecordMutationBarriersForTests(): void {
	for (const state of mutationStates.values()) {
		for (const resolve of state.waiters) resolve();
	}
	mutationStates.clear();
}
