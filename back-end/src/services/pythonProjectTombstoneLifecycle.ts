import type { Types as MongooseTypes } from "mongoose";
import { Types } from "mongoose";
import { PythonProject } from "../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../models/schemas/PythonProjectReview.js";
import { Student } from "../models/schemas/Student.js";
import { acquireVerifiedStudentRecordMutationLease } from "../security/studentRecordMutationBarrier.js";

export const PYTHON_PROJECT_TOMBSTONE_RETENTION_MS = 60 * 60 * 1000;
const TOMBSTONE_RECONCILIATION_INTERVAL_MS = 15 * 60 * 1000;

interface TombstoneWriteResult {
	acknowledged: boolean;
	deletedCount?: number;
	modifiedCount?: number;
}

interface TombstoneIndexDescription {
	expireAfterSeconds?: unknown;
	key?: Record<string, unknown>;
	name?: string;
}

interface TombstoneModel {
	collection: {
		dropIndex: (name: string) => Promise<unknown>;
		listIndexes: () => {
			toArray: () => Promise<TombstoneIndexDescription[]>;
		};
	};
	deleteMany: (
		filter: Record<string, unknown>
	) => { exec: () => Promise<TombstoneWriteResult> };
	distinct: (
		field: string,
		filter: Record<string, unknown>
	) => { exec: () => Promise<unknown[]> };
	syncIndexes: () => Promise<unknown>;
	updateMany: (
		filter: Record<string, unknown>,
		update: Record<string, unknown>
	) => { exec: () => Promise<TombstoneWriteResult> };
}

interface StudentPreservationState {
	_id: MongooseTypes.ObjectId;
	recordPreservationHoldActive?: boolean;
}

export interface PythonProjectTombstoneSweepResult {
	held: number;
	purgedProjects: number;
	purgedReviews: number;
	reconciled: number;
	scheduled: number;
	suspended: number;
}

export interface PythonProjectTombstoneStartupResult
	extends PythonProjectTombstoneSweepResult {
	droppedTtlIndexes: number;
}

const projectModel = PythonProject as unknown as TombstoneModel;
const reviewModel = PythonProjectReview as unknown as TombstoneModel;
const tombstoneModels = [projectModel, reviewModel];

export function pythonProjectTombstonePurgeAt(after: Date): Date {
	const timestamp = after.getTime();
	if (!Number.isFinite(timestamp)) {
		throw new TypeError("A valid tombstone purge anchor is required.");
	}
	return new Date(timestamp + PYTHON_PROJECT_TOMBSTONE_RETENTION_MS);
}

async function updateTombstones(
	model: TombstoneModel,
	filter: Record<string, unknown>,
	update: Record<string, unknown>
): Promise<number> {
	const result = await model.updateMany(filter, update).exec();
	if (!result.acknowledged) {
		throw new Error("Python project tombstone update was not acknowledged.");
	}
	return result.modifiedCount ?? 0;
}

async function updateAllTombstones(
	filter: Record<string, unknown>,
	update: Record<string, unknown>
): Promise<number> {
	const settled = await Promise.allSettled(
		tombstoneModels.map(model => updateTombstones(model, filter, update))
	);
	const errors = settled.flatMap(result =>
		result.status === "rejected" ? [result.reason] : []
	);
	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			"Python project and review tombstones were not updated together."
		);
	}
	return settled.reduce(
		(total, result) =>
			total + (result.status === "fulfilled" ? result.value : 0),
		0
	);
}

/**
 * Clearing the scheduled purge retains the fixed deletion marker and scrubbed
 * content while excluding the row from the application-owned purger.
 */
export async function suspendPythonProjectTombstonePurge(
	studentID: string
): Promise<void> {
	await updateAllTombstones(
		{
			purgeAt: { $exists: true },
			user: studentID
		},
		{ $unset: { purgeAt: 1 } }
	);
}

async function readStudentPreservationState(
	studentID: string
): Promise<"held" | "missing" | "released"> {
	const student = await Student.findById(studentID)
		.select("+recordPreservationHoldActive")
		.lean()
		.exec() as StudentPreservationState | null;
	if (!student) return "missing";
	return student.recordPreservationHoldActive ? "held" : "released";
}

/**
 * A released tombstone receives one fresh bounded grace period only when it
 * has no existing schedule. Retried releases therefore cannot backdate a newer
 * tombstone. Missing, active, or unreadable durable state remains unscheduled.
 */
export async function resumePythonProjectTombstonePurge(
	studentID: string,
	releasedAt: Date
): Promise<void> {
	let state: "held" | "missing" | "released";
	try {
		state = await readStudentPreservationState(studentID);
	}
	catch (error) {
		await suspendPythonProjectTombstonePurge(studentID).catch(() => undefined);
		throw error;
	}
	if (state !== "released") {
		await suspendPythonProjectTombstonePurge(studentID);
		throw new Error("Student preservation release could not be verified.");
	}

	const purgeAt = pythonProjectTombstonePurgeAt(releasedAt);
	await updateAllTombstones(
		{
			deletedAt: { $not: { $type: "date" } },
			purgeAt: { $exists: true },
			user: studentID
		},
		{ $unset: { purgeAt: 1 } }
	);
	await updateAllTombstones(
		{
			deletedAt: { $type: "date" },
			purgeAt: { $exists: false },
			user: studentID
		},
		{ $set: { purgeAt } }
	);

	try {
		state = await readStudentPreservationState(studentID);
	}
	catch (error) {
		await suspendPythonProjectTombstonePurge(studentID).catch(() => undefined);
		throw error;
	}
	if (state !== "released") {
		await suspendPythonProjectTombstonePurge(studentID);
		throw new Error("Student preservation state changed during purge scheduling.");
	}
}

async function tombstoneStudentIDs(): Promise<{
	ambiguous: number;
	studentIDs: MongooseTypes.ObjectId[];
}> {
	const values = await Promise.all(
		tombstoneModels.map(model =>
			model.distinct("user", {
				$or: [
					{ deletedAt: { $exists: true } },
					{ purgeAt: { $exists: true } }
				]
			}).exec()
		)
	);
	const unique = new Map<string, MongooseTypes.ObjectId>();
	let ambiguous = 0;
	for (const value of values.flat()) {
		if (!Types.ObjectId.isValid(value as string | MongooseTypes.ObjectId)) {
			ambiguous += 1;
			continue;
		}
		const id = new Types.ObjectId(value as string | MongooseTypes.ObjectId);
		unique.set(id.toHexString(), id);
	}
	return { ambiguous, studentIDs: [...unique.values()] };
}

async function deleteDueTombstones(
	model: TombstoneModel,
	studentID: MongooseTypes.ObjectId,
	now: Date
): Promise<number> {
	const result = await model.deleteMany({
		deletedAt: { $type: "date" },
		purgeAt: { $lte: now, $type: "date" },
		user: studentID
	}).exec();
	if (!result.acknowledged) {
		throw new Error("Python project tombstone purge was not acknowledged.");
	}
	return result.deletedCount ?? 0;
}

async function reconcileAndPurgeStudentTombstones(
	studentID: MongooseTypes.ObjectId,
	now: Date
): Promise<Omit<PythonProjectTombstoneSweepResult, "held"> | "held"> {
	const studentIDString = studentID.toHexString();
	const release = await acquireVerifiedStudentRecordMutationLease(
		studentIDString
	);
	if (!release) {
		// A closed process gate can mean either an active placement or an active
		// release transition. Only durable held/missing state authorizes suspension;
		// a durable release may be in the middle of restoring its schedule.
		const state = await readStudentPreservationState(studentIDString);
		if (state !== "released") {
			await suspendPythonProjectTombstonePurge(studentIDString);
		}
		return "held";
	}

	try {
		// acquireVerified... rejects a known hold; this positive read separately
		// prevents a missing student from being interpreted as permission to purge.
		const state = await readStudentPreservationState(studentIDString);
		if (state !== "released") {
			await suspendPythonProjectTombstonePurge(studentIDString);
			return "held";
		}

		const suspended = await updateAllTombstones(
			{
				deletedAt: { $not: { $type: "date" } },
				purgeAt: { $exists: true },
				user: studentID
			},
			{ $unset: { purgeAt: 1 } }
		);
		const scheduled = await updateAllTombstones(
			{
				deletedAt: { $type: "date" },
				purgeAt: { $exists: false },
				user: studentID
			},
			{ $set: { purgeAt: pythonProjectTombstonePurgeAt(now) } }
		);

		// Reviews go first so a partial failure cannot remove a project while
		// leaving its same-deadline review behind.
		const purgedReviews = await deleteDueTombstones(
			reviewModel,
			studentID,
			now
		);
		const purgedProjects = await deleteDueTombstones(
			projectModel,
			studentID,
			now
		);

		// A hold placement that arrived after this lease waits for release and then
		// performs the final suspension before its durable flag write.
		return {
			purgedProjects,
			purgedReviews,
			reconciled: 1,
			scheduled,
			suspended
		};
	}
	catch (error) {
		await suspendPythonProjectTombstonePurge(studentIDString).catch(
			() => undefined
		);
		throw error;
	}
	finally {
		release();
	}
}

/**
 * Reconcile and purge one student's tombstones at a time under the same
 * mutation lease used by preservation transitions. MongoDB has no TTL writer
 * for these rows, so a purge can occur only after a positive durable unheld
 * read inside that serialized application path.
 */
export async function enforcePythonProjectTombstoneLifecycle(
	now = new Date()
): Promise<PythonProjectTombstoneSweepResult> {
	pythonProjectTombstonePurgeAt(now);
	const { ambiguous, studentIDs } = await tombstoneStudentIDs();
	const result: PythonProjectTombstoneSweepResult = {
		held: ambiguous,
		purgedProjects: 0,
		purgedReviews: 0,
		reconciled: 0,
		scheduled: 0,
		suspended: 0
	};
	const errors: unknown[] = [];

	for (const studentID of studentIDs) {
		try {
			const studentResult = await reconcileAndPurgeStudentTombstones(
				studentID,
				now
			);
			if (studentResult === "held") {
				result.held += 1;
				continue;
			}
			result.purgedProjects += studentResult.purgedProjects;
			result.purgedReviews += studentResult.purgedReviews;
			result.reconciled += studentResult.reconciled;
			result.scheduled += studentResult.scheduled;
			result.suspended += studentResult.suspended;
		}
		catch (error) {
			errors.push(error);
		}
	}

	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			"Python project tombstone lifecycle could not be fully reconciled."
		);
	}
	return result;
}

function mongoErrorCode(error: unknown): number | undefined {
	return typeof error === "object" && error !== null && "code" in error
		? Number((error as { code?: unknown }).code)
		: undefined;
}

async function dropLegacyTombstoneTtlIndexes(
	model: TombstoneModel
): Promise<number> {
	let indexes: TombstoneIndexDescription[];
	try {
		indexes = await model.collection.listIndexes().toArray();
	}
	catch (error) {
		if (mongoErrorCode(error) === 26) return 0;
		throw error;
	}

	const candidates = indexes.filter((index) => {
		if (!("expireAfterSeconds" in index)) return false;
		const fields = Object.keys(index.key ?? {});
		return fields.length === 1
			&& (fields[0] === "deletedAt" || fields[0] === "purgeAt");
	});
	const settled = await Promise.allSettled(
		candidates.map(async (index) => {
			if (!index.name) {
				throw new Error("A tombstone TTL index did not have a removable name.");
			}
			try {
				await model.collection.dropIndex(index.name);
				return 1;
			}
			catch (error) {
				if (mongoErrorCode(error) !== 27) throw error;
				return 0;
			}
		})
	);
	const errors = settled.flatMap(result =>
		result.status === "rejected" ? [result.reason] : []
	);
	if (errors.length > 0) {
		throw new AggregateError(
			errors,
			"Legacy tombstone TTL indexes could not all be removed."
		);
	}
	return settled.reduce(
		(total, result) =>
			total + (result.status === "fulfilled" ? result.value : 0),
		0
	);
}

/**
 * Run before HTTP listen: remove every legacy/current tombstone TTL writer,
 * reconcile and safely purge through application leases, then build only the
 * schema's normal purgeAt lookup indexes.
 */
export async function preparePythonProjectTombstoneLifecycle(
	now = new Date()
): Promise<PythonProjectTombstoneStartupResult> {
	const settledDrops = await Promise.allSettled(
		tombstoneModels.map(model => dropLegacyTombstoneTtlIndexes(model))
	);
	const dropErrors = settledDrops.flatMap(result =>
		result.status === "rejected" ? [result.reason] : []
	);
	if (dropErrors.length > 0) {
		throw new AggregateError(
			dropErrors,
			"Legacy project and review TTL removal did not complete safely."
		);
	}
	const reconciled = await enforcePythonProjectTombstoneLifecycle(now);
	await Promise.all(tombstoneModels.map(model => model.syncIndexes()));
	return {
		droppedTtlIndexes: settledDrops.reduce(
			(total, result) =>
				total + (result.status === "fulfilled" ? result.value : 0),
			0
		),
		...reconciled
	};
}

export function startPythonProjectTombstoneReconciler(
	runReconciliation: () => Promise<PythonProjectTombstoneSweepResult>
		= () => enforcePythonProjectTombstoneLifecycle()
): () => Promise<void> {
	let running = false;
	let activeReconciliation: Promise<void> | null = null;
	const timer = setInterval(() => {
		if (running) return;
		running = true;
		activeReconciliation = runReconciliation()
			.then(() => undefined)
			.catch((error) => {
				console.error("Python project tombstone reconciliation failed.", error);
			})
			.finally(() => {
				running = false;
				activeReconciliation = null;
			});
	}, TOMBSTONE_RECONCILIATION_INTERVAL_MS);
	timer.unref();
	return async () => {
		clearInterval(timer);
		await activeReconciliation;
	};
}
