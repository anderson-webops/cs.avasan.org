import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { setStudentRecordPreservationHold } from "../../services/studentRecordPreservation.js";
import { serializeStudentRecordPreservation } from "./studentController.js";

function studentIdParam(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): string | null {
	const rawStudentID = req.params.studentID;
	const studentID = Array.isArray(rawStudentID) ? rawStudentID[0] : rawStudentID;
	if (typeof studentID !== "string" || !Types.ObjectId.isValid(studentID)) {
		res.status(400).json({ message: "Invalid student ID." });
		return null;
	}
	return studentID.toLowerCase();
}

function bodyHasOnlyKeys(body: unknown, allowedKeys: readonly string[]): boolean {
	if (!body || typeof body !== "object" || Array.isArray(body)) return false;
	const allowed = new Set(allowedKeys);
	return Object.keys(body).every(key => allowed.has(key));
}

async function teacherPasswordVerified(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): Promise<boolean> {
	const { teacherPassword } = req.body as { teacherPassword?: unknown };
	if (typeof teacherPassword !== "string" || !teacherPassword) {
		res.status(400).json({ message: "Julio’s password is required." });
		return false;
	}
	if (!req.currentAdmin || !(await req.currentAdmin.comparePassword(teacherPassword))) {
		res.status(403).json({ message: "Julio’s password is incorrect." });
		return false;
	}
	return true;
}

export const setStudentRecordPreservation: RequestHandler = async (req, res) => {
	if (!bodyHasOnlyKeys(req.body, ["active", "teacherPassword"])) {
		return res.status(400).json({
			message: "Only preservation status and Julio’s password are accepted."
		});
	}
	const { active } = req.body as { active?: unknown };
	if (typeof active !== "boolean") {
		return res.status(400).json({
			message: "Preservation status must be true or false."
		});
	}
	if (!(await teacherPasswordVerified(req, res))) return;

	const studentID = studentIdParam(req, res);
	if (!studentID) return;

	try {
		const result = await setStudentRecordPreservationHold(
			studentID,
			active
		);
		if (result.state === "not-found") return res.sendStatus(404);
		if (result.state === "already-active") {
			return res.status(409).json({
				message: "This student already has an active record-preservation hold."
			});
		}
		if (result.state === "already-released") {
			return res.status(409).json({
				message: "This student does not have an active record-preservation hold."
			});
		}
		if (result.state === "state-changed") {
			return res.status(409).json({
				message: "The student account changed. Reload and try again."
			});
		}
		if (!result.student) {
			return res.status(503).json({
				message: "Record-preservation status could not be confirmed."
			});
		}

		return res.json({
			recordPreservation: serializeStudentRecordPreservation(result.student)
		});
	}
	catch {
		return res.status(503).json({
			message: "Record-preservation status could not be changed."
		});
	}
};
