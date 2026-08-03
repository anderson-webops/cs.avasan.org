import type { IStudent } from "../types/entities/IStudent.js";
import { Student } from "../models/schemas/Student.js";
import {
	closeStudentDataWritesAndWait,
	reopenStudentDataLeaseGateForPreservation
} from "../security/studentDataWriteBarrier.js";
import {
	holdStudentRecordMutationsAndWait,
	releaseStudentRecordMutationHold
} from "../security/studentRecordMutationBarrier.js";
import {
	resumePythonProjectTombstonePurge,
	suspendPythonProjectTombstonePurge
} from "./pythonProjectTombstoneLifecycle.js";

const RECORD_PRESERVATION_SELECT
	= "+dataDeletionPendingAt +recordPreservationHoldActive"
		+ " +recordPreservationHoldPlacedAt +recordPreservationHoldReleasedAt"
		+ " +recordPreservationEvents";

export const STUDENT_RECORD_PRESERVATION_EVENT_LIMIT = 32;

export type StudentRecordPreservationTransitionState
	= | "already-active"
		| "already-released"
		| "not-found"
		| "state-changed"
		| "updated";

export interface StudentRecordPreservationTransition {
	state: StudentRecordPreservationTransitionState;
	student: IStudent | null;
}

const preservationTransitionTails = new Map<string, Promise<void>>();

async function acquirePreservationTransitionLease(
	studentID: string
): Promise<() => void> {
	const key = studentID.toLowerCase();
	const previous = preservationTransitionTails.get(key) ?? Promise.resolve();
	let releaseCurrent: () => void = () => undefined;
	const current = new Promise<void>((resolve) => {
		releaseCurrent = resolve;
	});
	const tail = previous.then(() => current);
	preservationTransitionTails.set(key, tail);
	await previous;

	let released = false;
	return () => {
		if (released) return;
		released = true;
		releaseCurrent();
		if (preservationTransitionTails.get(key) === tail) {
			preservationTransitionTails.delete(key);
		}
	};
}

async function readStudentPreservationState(
	studentID: string
): Promise<IStudent | null> {
	return Student.findById(studentID).select(RECORD_PRESERVATION_SELECT);
}

/**
 * Atomically place or release the fixed-purpose FERPA inspection/review hold.
 * The audit event shape has no caller-provided text or requester identity.
 */
async function applyStudentRecordPreservationHold(
	studentID: string,
	active: boolean,
	at?: Date
): Promise<StudentRecordPreservationTransition> {
	if (active) {
		await holdStudentRecordMutationsAndWait(studentID);
		const transitionAt = at ?? new Date();
		try {
			// Suspend the application-owned cleanup schedule before the durable hold
			// is written. A partial suspension is conservative; the hold is not placed
			// unless both project collections acknowledge the change.
			await suspendPythonProjectTombstonePurge(studentID);
			const student = await Student.findOneAndUpdate(
				{
					_id: studentID,
					recordPreservationHoldActive: { $ne: true }
				},
				{
					$push: {
						recordPreservationEvents: {
							$each: [{ action: "placed", at: transitionAt }],
							$slice: -STUDENT_RECORD_PRESERVATION_EVENT_LIMIT
						}
					},
					$set: {
						recordPreservationHoldActive: true,
						recordPreservationHoldPlacedAt: transitionAt
					},
					$unset: { recordPreservationHoldReleasedAt: 1 }
				},
				{ new: true }
			).select(RECORD_PRESERVATION_SELECT);
			if (student) {
				if (student.dataDeletionPendingAt) {
					reopenStudentDataLeaseGateForPreservation(studentID);
				}
				return { state: "updated", student };
			}

			const existing = await readStudentPreservationState(studentID);
			if (existing?.recordPreservationHoldActive) {
				if (existing.dataDeletionPendingAt) {
					reopenStudentDataLeaseGateForPreservation(studentID);
				}
				return { state: "already-active", student: existing };
			}
			if (existing) {
				await resumePythonProjectTombstonePurge(
					studentID,
					existing.recordPreservationHoldReleasedAt ?? transitionAt
				);
			}
			releaseStudentRecordMutationHold(studentID);
			if (!existing) return { state: "not-found", student: null };
			return { state: "state-changed", student: existing };
		}
		catch (error) {
			// A failed response can follow a successful database write. Re-read
			// before reopening; if that read also fails, remain closed fail-safely.
			const current = await readStudentPreservationState(studentID).catch(
				() => undefined
			);
			if (
				current !== undefined
				&& !current?.recordPreservationHoldActive
			) {
				const lifecycleReconciled = current
					? await resumePythonProjectTombstonePurge(
							studentID,
							current.recordPreservationHoldReleasedAt ?? transitionAt
						).then(
							() => true,
							() => false
						)
					: await suspendPythonProjectTombstonePurge(studentID).then(
							() => true,
							() => false
						);
				if (lifecycleReconciled) {
					releaseStudentRecordMutationHold(studentID);
				}
			}
			else if (current?.recordPreservationHoldActive) {
				await suspendPythonProjectTombstonePurge(studentID).catch(
					() => undefined
				);
				if (current.dataDeletionPendingAt) {
					reopenStudentDataLeaseGateForPreservation(studentID);
				}
			}
			throw error;
		}
	}

	await holdStudentRecordMutationsAndWait(studentID);
	const transitionAt = at ?? new Date();
	try {
		const student = await Student.findOneAndUpdate(
			{
				_id: studentID,
				recordPreservationHoldActive: true
			},
			{
				$push: {
					recordPreservationEvents: {
						$each: [{ action: "released", at: transitionAt }],
						$slice: -STUDENT_RECORD_PRESERVATION_EVENT_LIMIT
					}
				},
				$set: {
					recordPreservationHoldActive: false,
					recordPreservationHoldReleasedAt: transitionAt
				}
			},
			{ new: true }
		).select(RECORD_PRESERVATION_SELECT);
		if (student) {
			if (student.dataDeletionPendingAt) {
				await closeStudentDataWritesAndWait(studentID);
			}
			await resumePythonProjectTombstonePurge(
				studentID,
				student.recordPreservationHoldReleasedAt ?? transitionAt
			);
			releaseStudentRecordMutationHold(studentID);
			return { state: "updated", student };
		}

		const existing = await readStudentPreservationState(studentID);
		if (!existing) {
			await suspendPythonProjectTombstonePurge(studentID);
			releaseStudentRecordMutationHold(studentID);
			return { state: "not-found", student: null };
		}
		if (!existing.recordPreservationHoldActive) {
			if (existing.dataDeletionPendingAt) {
				await closeStudentDataWritesAndWait(studentID);
			}
			await resumePythonProjectTombstonePurge(
				studentID,
				existing.recordPreservationHoldReleasedAt ?? transitionAt
			);
			releaseStudentRecordMutationHold(studentID);
			return { state: "already-released", student: existing };
		}
		await suspendPythonProjectTombstonePurge(studentID);
		return { state: "state-changed", student: existing };
	}
	catch (error) {
		// A failed response can follow a successful durable release. Reopen only
		// after a re-read confirms the record is absent or the flag is false; an
		// uncertain read leaves the process gate closed fail-safely.
		const current = await readStudentPreservationState(studentID).catch(
			() => undefined
		);
		if (
			current !== undefined
			&& !current?.recordPreservationHoldActive
		) {
			if (current?.dataDeletionPendingAt) {
				await closeStudentDataWritesAndWait(studentID);
			}
			const lifecycleReconciled = current
				? await resumePythonProjectTombstonePurge(
						studentID,
						current.recordPreservationHoldReleasedAt ?? transitionAt
					).then(
						() => true,
						() => false
					)
				: await suspendPythonProjectTombstonePurge(studentID).then(
						() => true,
						() => false
					);
			if (lifecycleReconciled) {
				releaseStudentRecordMutationHold(studentID);
			}
		}
		else if (current?.recordPreservationHoldActive) {
			await suspendPythonProjectTombstonePurge(studentID).catch(
				() => undefined
			);
		}
		throw error;
	}
}

/**
 * Serialize every place/release transition for one student. The transition
 * lease is process-local ordering only; the durable flag and mutation gate
 * remain the restart-safe, fail-closed enforcement boundary.
 */
export async function setStudentRecordPreservationHold(
	studentID: string,
	active: boolean,
	at?: Date
): Promise<StudentRecordPreservationTransition> {
	const releaseTransition = await acquirePreservationTransitionLease(studentID);
	try {
		return await applyStudentRecordPreservationHold(studentID, active, at);
	}
	finally {
		releaseTransition();
	}
}
