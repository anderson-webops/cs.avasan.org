import type { Request, RequestHandler } from "express";
import type { IStudent } from "../../types/entities/IStudent.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Types } from "mongoose";
import { Admin } from "../../models/schemas/Admin.js";
import { PythonProject } from "../../models/schemas/PythonProject.js";
import { Student } from "../../models/schemas/Student.js";
import { ADMIN_SINGLETON_ID } from "../../security/adminIdentity.js";
import {
	adminSessionTimingIsCurrent
} from "../../security/adminSession.js";
import { revokeSessionIdentities } from "../../security/sessionLifecycle.js";
import {
	generateStudentAccessCode,
	hashStudentCredential,
	isValidStudentPassword,
	isValidStudentUsername,
	MAX_STUDENT_PASSWORD_LENGTH,
	MIN_STUDENT_PASSWORD_LENGTH,
	normalizeStudentAccessCode,
	normalizeStudentUsername,
	STUDENT_ABSOLUTE_SESSION_MS,
	STUDENT_INACTIVITY_TIMEOUT_MS,
	STUDENT_SETUP_SESSION_MS,
	studentAccessCodeExpiry,
	verifyStudentCredential
} from "../../security/studentCredentials.js";
import {
	clearStudentOAuthBrowserBindings
} from "../../utils/studentOAuthCookies.js";

const INVALID_STUDENT_CREDENTIALS = {
	message: "Invalid username or credential."
};
const STUDENT_LOGIN_FAILURE_THRESHOLD = 5;
const STUDENT_LOGIN_COOLDOWN_MS = 2 * 60 * 1000;
const PASSWORD_SETUP_REQUEST_ID_RE = /^[\w-]{32,128}$/;

interface StudentProjectActivity {
	_id: Types.ObjectId;
	lastProjectSavedAt: Date;
	projectCount: number;
}

export function serializeStudent(student: IStudent) {
	return {
		_id: student._id.toString(),
		username: student.username,
		active: student.active,
		passwordSetAt: student.passwordSetAt ?? null,
		lastLoginAt: student.lastLoginAt ?? null,
		createdAt: student.createdAt,
		updatedAt: student.updatedAt
	};
}

export type StudentCredentialState
	= | "password"
		| "access-code"
		| "social"
		| "setup"
		| "expired-code"
		| "none";

function studentSocialProviders(student: IStudent) {
	return student.externalAuthProvider
		? [student.externalAuthProvider]
		: [];
}

export function serializeManagedStudent(student: IStudent, now = Date.now()) {
	let credentialState: StudentCredentialState = "none";
	if (student.passwordHash) {
		credentialState = "password";
	}
	else if (
		student.pendingSetupCodeHash
		&& student.accessCodeExpiresAt
		&& student.accessCodeExpiresAt.getTime() > now
	) {
		credentialState = "setup";
	}
	else if (
		student.accessCodeHash
		&& student.accessCodeExpiresAt
		&& student.accessCodeExpiresAt.getTime() > now
	) {
		credentialState = "access-code";
	}
	else if (student.accessCodeHash || student.pendingSetupCodeHash) {
		credentialState = "expired-code";
	}
	else if (
		student.externalAuthProvider
		&& student.externalAuthSubjectHash
	) {
		credentialState = "social";
	}

	return {
		...serializeStudent(student),
		credentialState,
		accessCodeExpiresAt: student.accessCodeExpiresAt ?? null,
		socialProviders: studentSocialProviders(student)
	};
}

function studentSession(req: Request): CustomSession | undefined {
	return req.session as CustomSession | undefined;
}

function clearStudentIdentity(session: CustomSession | undefined): void {
	if (!session) return;
	delete session.studentID;
	delete session.studentExpiresAt;
	delete session.studentSessionVersion;
	delete session.studentAuthLevel;
	delete session.studentSetupExpiresAt;
	delete session.studentLastActivityAt;
}

function clearAdminIdentity(session: CustomSession | undefined): void {
	if (!session) return;
	delete session.adminID;
	delete session.adminExpiresAt;
	delete session.adminLastActivityAt;
	delete session.adminSessionVersion;
}

function studentSessionTimingIsCurrent(
	session: CustomSession,
	now = Date.now()
): boolean {
	if (session.studentAuthLevel === "setup") {
		return Number.isSafeInteger(session.studentSetupExpiresAt)
			&& (session.studentSetupExpiresAt ?? 0) > now;
	}
	if (session.studentAuthLevel === "full") {
		return Number.isSafeInteger(session.studentExpiresAt)
			&& (session.studentExpiresAt ?? 0) > now
			&& Number.isSafeInteger(session.studentLastActivityAt)
			&& now - (session.studentLastActivityAt ?? 0) < STUDENT_INACTIVITY_TIMEOUT_MS;
	}
	return false;
}

export async function hasLiveAuthenticatedIdentity(
	req: Request
): Promise<boolean> {
	const session = studentSession(req);
	if (!session) return false;

	if (
		session.adminID === ADMIN_SINGLETON_ID
		&& adminSessionTimingIsCurrent(session)
		&& Number.isSafeInteger(session.adminSessionVersion)
	) {
		const admin = await Admin.findById(ADMIN_SINGLETON_ID)
			.select("+sessionVersion");
		const adminSessionVersion = Number.isSafeInteger(admin?.sessionVersion)
			? admin?.sessionVersion
			: 0;
		if (admin && adminSessionVersion === session.adminSessionVersion) {
			return true;
		}
	}
	if (
		session.adminID
		|| session.adminLastActivityAt !== undefined
		|| session.adminSessionVersion !== undefined
	) {
		clearAdminIdentity(session);
	}

	if (
		session.studentID
		&& Number.isSafeInteger(session.studentSessionVersion)
		&& studentSessionTimingIsCurrent(session)
	) {
		const student = await Student.findById(session.studentID)
			.select("+sessionVersion");
		if (
			student
			&& student.active
			&& student.sessionVersion === session.studentSessionVersion
		) {
			return true;
		}
	}
	if (
		session.studentID
		|| session.studentSessionVersion !== undefined
		|| session.studentAuthLevel
	) {
		clearStudentIdentity(session);
	}
	return false;
}

export function setStudentIdentity(
	req: Request,
	student: IStudent,
	authLevel: "setup" | "full",
	absoluteExpiry?: number
): boolean {
	const session = studentSession(req);
	if (!session) return false;

	delete session.adminID;
	delete session.adminExpiresAt;
	delete session.adminLastActivityAt;
	delete session.adminSessionVersion;
	session.studentID = student._id.toString();
	session.studentSessionVersion = student.sessionVersion;
	session.studentAuthLevel = authLevel;
	if (authLevel === "setup") {
		session.studentSetupExpiresAt = Date.now() + STUDENT_SETUP_SESSION_MS;
		delete session.studentExpiresAt;
		delete session.studentLastActivityAt;
	}
	else {
		session.studentExpiresAt = absoluteExpiry
			?? Date.now() + STUDENT_ABSOLUTE_SESSION_MS;
		session.studentLastActivityAt = Date.now();
		delete session.studentSetupExpiresAt;
	}

	const options = ((req as any).sessionOptions ??= {});
	delete options.maxAge;
	delete options.expires;
	return true;
}

function studentIdParam(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): string | null {
	const rawStudentID = req.params.studentID;
	const studentID = Array.isArray(rawStudentID)
		? rawStudentID[0]
		: rawStudentID;
	if (typeof studentID !== "string" || !Types.ObjectId.isValid(studentID)) {
		res.status(400).json({ message: "Invalid student ID." });
		return null;
	}
	return studentID;
}

async function teacherPasswordVerified(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
): Promise<boolean> {
	const { teacherPassword } = req.body as { teacherPassword?: unknown };
	if (typeof teacherPassword !== "string" || !teacherPassword) {
		res.status(400).json({ message: "Teacher password is required." });
		return false;
	}

	const admin = req.currentAdmin;
	if (!admin || !(await admin.comparePassword(teacherPassword))) {
		res.status(403).json({ message: "Teacher password is incorrect." });
		return false;
	}

	return true;
}

function isDuplicateKeyError(error: unknown): boolean {
	return typeof error === "object"
		&& error !== null
		&& "code" in error
		&& (error as { code?: unknown }).code === 11000;
}

function bodyHasOnlyKeys(body: unknown, allowedKeys: readonly string[]): boolean {
	if (!body || typeof body !== "object" || Array.isArray(body)) return false;
	const allowed = new Set(allowedKeys);
	return Object.keys(body).every(key => allowed.has(key));
}

async function recordStudentLoginFailure(student: IStudent): Promise<void> {
	const nextFailureCount = {
		$add: [{ $ifNull: ["$failedLoginAttempts", 0] }, 1]
	};
	const thresholdReached = {
		$gte: [nextFailureCount, STUDENT_LOGIN_FAILURE_THRESHOLD]
	};
	await Student.updateOne(
		{ _id: student._id, active: true },
		[
			{
				$set: {
					failedLoginAttempts: {
						$cond: [thresholdReached, 0, nextFailureCount]
					},
					lockedUntil: {
						$cond: [
							thresholdReached,
							new Date(Date.now() + STUDENT_LOGIN_COOLDOWN_MS),
							"$lockedUntil"
						]
					}
				}
			}
		]
	);
}

export const createStudentSession: RequestHandler = async (req, res) => {
	const { username, secret } = (req.body ?? {}) as {
		username?: unknown;
		secret?: unknown;
	};
	if (
		typeof username !== "string"
		|| typeof secret !== "string"
		|| !username.trim()
		|| !secret
		|| secret.length > MAX_STUDENT_PASSWORD_LENGTH
	) {
		return res.status(400).json({ message: "Username and credential are required." });
	}
	if (await hasLiveAuthenticatedIdentity(req)) {
		return res.status(409).json({
			message: "An account is already signed in. Sign out before switching accounts."
		});
	}

	const normalizedUsername = normalizeStudentUsername(username);
	const student = await Student.findOne({ username: normalizedUsername })
		.select(
			"+passwordHash +accessCodeHash +sessionVersion"
			+ " +failedLoginAttempts +lockedUntil"
		)
		.exec();

	const usesPassword = Boolean(student?.passwordHash);
	const credentialMatches = await verifyStudentCredential(
		usesPassword ? student?.passwordHash : student?.accessCodeHash,
		usesPassword ? secret : normalizeStudentAccessCode(secret)
	);

	if (!student || !student.active) {
		return res.status(403).json(INVALID_STUDENT_CREDENTIALS);
	}
	if (student.lockedUntil && student.lockedUntil.getTime() > Date.now()) {
		return res.status(403).json(INVALID_STUDENT_CREDENTIALS);
	}

	if (student.passwordHash && credentialMatches) {
		const authenticated = await Student.findOneAndUpdate(
			{
				_id: student._id,
				active: true,
				passwordHash: student.passwordHash,
				sessionVersion: student.sessionVersion
			},
			{
				$inc: { sessionVersion: 1 },
				$set: {
					failedLoginAttempts: 0,
					lastLoginAt: new Date()
				},
				$unset: { lockedUntil: 1 }
			},
			{ new: true }
		).select("+sessionVersion");
		if (!authenticated) {
			return res.status(403).json(INVALID_STUDENT_CREDENTIALS);
		}
		if (!setStudentIdentity(req, authenticated, "full")) {
			return res.status(500).json({ message: "Session unavailable." });
		}
		clearStudentOAuthBrowserBindings(res);
		return res.json({
			student: serializeStudent(authenticated),
			requiresPasswordSetup: false
		});
	}

	const accessCodeIsCurrent = student.accessCodeHash
		&& student.accessCodeExpiresAt
		&& student.accessCodeExpiresAt.getTime() > Date.now()
		&& credentialMatches;
	if (!accessCodeIsCurrent) {
		await recordStudentLoginFailure(student);
		return res.status(403).json(INVALID_STUDENT_CREDENTIALS);
	}

	// Consume the single-use code using its exact hash and current session
	// version. The pending hash is retained only inside this setup lifecycle so
	// the student cannot choose the access code as their password.
	const setupStartedAt = new Date();
	const setupExpiresAt = new Date(
		setupStartedAt.getTime() + STUDENT_SETUP_SESSION_MS
	);
	const consumed = await Student.findOneAndUpdate(
		{
			_id: student._id,
			active: true,
			accessCodeHash: student.accessCodeHash,
			accessCodeExpiresAt: { $gt: setupStartedAt },
			sessionVersion: student.sessionVersion
		},
		{
			$inc: { sessionVersion: 1 },
			$set: {
				accessCodeExpiresAt: setupExpiresAt,
				failedLoginAttempts: 0,
				lastLoginAt: setupStartedAt,
				pendingSetupCodeHash: student.accessCodeHash
			},
			$unset: {
				accessCodeHash: 1,
				lastPasswordSetupRequestID: 1,
				lockedUntil: 1,
				passwordHash: 1,
				passwordSetAt: 1
			}
		},
		{ new: true }
	).select("+sessionVersion");
	if (!consumed) {
		return res.status(403).json(INVALID_STUDENT_CREDENTIALS);
	}
	if (!setStudentIdentity(req, consumed, "setup")) {
		return res.status(500).json({ message: "Session unavailable." });
	}
	clearStudentOAuthBrowserBindings(res);
	return res.json({
		student: serializeStudent(consumed),
		requiresPasswordSetup: true
	});
};

export const getStudentSession: RequestHandler = async (req, res) => {
	const session = studentSession(req);
	if (
		!session?.studentID
		|| !Number.isSafeInteger(session.studentSessionVersion)
		|| (session.studentAuthLevel !== "setup" && session.studentAuthLevel !== "full")
	) {
		return res.json({ student: null, requiresPasswordSetup: false });
	}

	const now = Date.now();
	if (!studentSessionTimingIsCurrent(session, now)) {
		clearStudentIdentity(session);
		return res.json({ student: null, requiresPasswordSetup: false });
	}

	const student = await Student.findById(session.studentID)
		.select("+sessionVersion +passwordHash +lastPasswordSetupRequestID");
	if (
		!student
		|| !student.active
	) {
		clearStudentIdentity(session);
		return res.json({ student: null, requiresPasswordSetup: false });
	}

	if (
		session.studentAuthLevel === "setup"
		&& student.sessionVersion === (session.studentSessionVersion ?? 0) + 1
		&& student.passwordHash
		&& student.passwordSetAt
		&& student.lastPasswordSetupRequestID
	) {
		const recoveryRequestID = req.get("X-Password-Setup-Request-ID");
		if (
			!recoveryRequestID
			|| !PASSWORD_SETUP_REQUEST_ID_RE.test(recoveryRequestID)
			|| recoveryRequestID !== student.lastPasswordSetupRequestID
		) {
			clearStudentIdentity(session);
			return res.json({ student: null, requiresPasswordSetup: false });
		}
		const absoluteExpiry = student.passwordSetAt.getTime()
			+ STUDENT_ABSOLUTE_SESSION_MS;
		if (!setStudentIdentity(req, student, "full", absoluteExpiry)) {
			return res.status(500).json({ message: "Session unavailable." });
		}
		clearStudentOAuthBrowserBindings(res);
		return res.json({
			student: serializeStudent(student),
			requiresPasswordSetup: false,
			passwordSetupRequestID: student.lastPasswordSetupRequestID
		});
	}

	if (student.sessionVersion !== session.studentSessionVersion) {
		clearStudentIdentity(session);
		return res.json({ student: null, requiresPasswordSetup: false });
	}

	if (
		session.studentAuthLevel === "full"
		&& req.get("X-Student-Activity") === "1"
	) {
		session.studentLastActivityAt = now;
	}
	const response: Record<string, unknown> = {
		student: serializeStudent(student),
		requiresPasswordSetup: session.studentAuthLevel === "setup"
	};
	if (
		session.studentAuthLevel === "full"
		&& student.lastPasswordSetupRequestID
	) {
		response.passwordSetupRequestID = student.lastPasswordSetupRequestID;
	}
	return res.json(response);
};

export const setStudentPassword: RequestHandler = async (req, res) => {
	const { password, requestID } = (req.body ?? {}) as {
		password?: unknown;
		requestID?: unknown;
	};
	if (
		typeof requestID !== "string"
		|| !PASSWORD_SETUP_REQUEST_ID_RE.test(requestID)
	) {
		return res.status(400).json({
			message: "A strong password setup request ID is required."
		});
	}
	const session = studentSession(req);
	if (
		!session?.studentID
		|| !Number.isSafeInteger(session.studentSessionVersion)
		|| (session.studentAuthLevel !== "setup" && session.studentAuthLevel !== "full")
		|| !studentSessionTimingIsCurrent(session)
	) {
		clearStudentIdentity(session);
		return res.status(403).json({ message: "Student setup session required." });
	}

	let currentStudent = await Student.findById(session.studentID)
		.select(
			"+sessionVersion +passwordHash +pendingSetupCodeHash +lastPasswordSetupRequestID"
		);
	if (!currentStudent || !currentStudent.active) {
		clearStudentIdentity(session);
		return res.status(403).json({ message: "Student setup session expired." });
	}

	const completedRequestMatches = Boolean(
		currentStudent.passwordHash
		&& currentStudent.passwordSetAt
		&& currentStudent.lastPasswordSetupRequestID === requestID
		&& (
			currentStudent.sessionVersion === session.studentSessionVersion
			|| (
				session.studentAuthLevel === "setup"
				&& currentStudent.sessionVersion
				=== (session.studentSessionVersion ?? 0) + 1
			)
		)
	);
	if (completedRequestMatches) {
		const replayPasswordMatches = typeof password === "string"
			&& await verifyStudentCredential(
				currentStudent.passwordHash,
				password
			);
		if (!replayPasswordMatches) {
			return res.status(409).json({
				message: "Password setup was completed with a different payload."
			});
		}
		const absoluteExpiry = session.studentAuthLevel === "full"
			? session.studentExpiresAt
			: (currentStudent.passwordSetAt?.getTime() ?? Date.now())
				+ STUDENT_ABSOLUTE_SESSION_MS;
		if (!setStudentIdentity(req, currentStudent, "full", absoluteExpiry)) {
			return res.status(500).json({ message: "Session unavailable." });
		}
		clearStudentOAuthBrowserBindings(res);
		return res.json({
			student: serializeStudent(currentStudent),
			requiresPasswordSetup: false,
			passwordSetupRequestID: requestID
		});
	}

	if (
		session.studentAuthLevel !== "setup"
		|| currentStudent.sessionVersion !== session.studentSessionVersion
		|| !currentStudent.pendingSetupCodeHash
	) {
		return res.status(409).json({
			message: "Password setup was completed by another request."
		});
	}

	if (!isValidStudentPassword(password)) {
		return res.status(400).json({
			message: `Password must be ${MIN_STUDENT_PASSWORD_LENGTH} to ${MAX_STUDENT_PASSWORD_LENGTH} characters.`
		});
	}
	if (normalizeStudentUsername(password) === currentStudent.username) {
		return res.status(400).json({
			message: "Password must be different from the username."
		});
	}
	if (
		await verifyStudentCredential(
			currentStudent.pendingSetupCodeHash,
			normalizeStudentAccessCode(password)
		)
	) {
		return res.status(400).json({
			message: "Password must be different from the one-time access code."
		});
	}

	const passwordHash = await hashStudentCredential(password);
	const passwordSetAt = new Date();
	const updated = await Student.findOneAndUpdate(
		{
			_id: currentStudent._id,
			active: true,
			pendingSetupCodeHash: currentStudent.pendingSetupCodeHash,
			sessionVersion: currentStudent.sessionVersion
		},
		{
			$inc: { sessionVersion: 1 },
			$set: {
				failedLoginAttempts: 0,
				lastLoginAt: passwordSetAt,
				lastPasswordSetupRequestID: requestID,
				passwordHash,
				passwordSetAt
			},
			$unset: {
				accessCodeHash: 1,
				accessCodeExpiresAt: 1,
				pendingSetupCodeHash: 1,
				lockedUntil: 1
			}
		},
		{ new: true }
	).select("+sessionVersion +lastPasswordSetupRequestID");
	if (!updated) {
		currentStudent = await Student.findById(session.studentID)
			.select(
				"+sessionVersion +passwordHash +pendingSetupCodeHash +lastPasswordSetupRequestID"
			);
		if (
			currentStudent
			&& currentStudent.active
			&& currentStudent.passwordHash
			&& currentStudent.passwordSetAt
			&& currentStudent.lastPasswordSetupRequestID === requestID
			&& currentStudent.sessionVersion
			=== (session.studentSessionVersion ?? 0) + 1
		) {
			if (!(await verifyStudentCredential(
				currentStudent.passwordHash,
				password
			))) {
				return res.status(409).json({
					message: "Password setup was completed with a different payload."
				});
			}
			if (!setStudentIdentity(
				req,
				currentStudent,
				"full",
				currentStudent.passwordSetAt.getTime() + STUDENT_ABSOLUTE_SESSION_MS
			)) {
				return res.status(500).json({ message: "Session unavailable." });
			}
			clearStudentOAuthBrowserBindings(res);
			return res.json({
				student: serializeStudent(currentStudent),
				requiresPasswordSetup: false,
				passwordSetupRequestID: requestID
			});
		}

		return res.status(409).json({
			message: "Password setup was completed by another request."
		});
	}
	if (!setStudentIdentity(
		req,
		updated,
		"full",
		passwordSetAt.getTime() + STUDENT_ABSOLUTE_SESSION_MS
	)) {
		return res.status(500).json({ message: "Session unavailable." });
	}
	clearStudentOAuthBrowserBindings(res);
	return res.json({
		student: serializeStudent(updated),
		requiresPasswordSetup: false,
		passwordSetupRequestID: requestID
	});
};

export const deleteStudentSession: RequestHandler = async (req, res) => {
	const session = studentSession(req);
	clearStudentOAuthBrowserBindings(res);
	try {
		await revokeSessionIdentities(session);
	}
	catch {
		(req.session as any) = null;
		return res.status(503).json({
			message: "Signed out here, but other session copies could not be revoked."
		});
	}

	(req.session as any) = null;
	return res.sendStatus(204);
};

export const listStudents: RequestHandler = async (_req, res) => {
	const students = await Student.find({})
		.select(
			"+passwordHash +accessCodeHash +pendingSetupCodeHash"
			+ " +externalAuthProvider +externalAuthSubjectHash"
		)
		.sort({ username: 1 })
		.limit(500);
	const projectActivity: StudentProjectActivity[] = [];
	if (students.length) {
		projectActivity.push(
			...await PythonProject.aggregate<StudentProjectActivity>([
				{
					$match: {
						deletedAt: { $exists: false },
						user: { $in: students.map(student => student._id) }
					}
				},
				{
					$group: {
						_id: "$user",
						lastProjectSavedAt: { $max: "$updatedAt" },
						projectCount: { $sum: 1 }
					}
				}
			])
		);
	}
	const projectsByStudentID = new Map(
		projectActivity.map(activity => [activity._id.toString(), activity])
	);
	return res.json({
		students: students.map((student) => {
			const projectMetadata = projectsByStudentID.get(student._id.toString());
			return {
				...serializeManagedStudent(student),
				projectCount: projectMetadata?.projectCount ?? 0,
				lastProjectSavedAt: projectMetadata?.lastProjectSavedAt ?? null
			};
		})
	});
};

export const createStudent: RequestHandler = async (req, res) => {
	if (!bodyHasOnlyKeys(req.body, ["teacherPassword", "username"])) {
		return res.status(400).json({
			message: "Only username and teacher password are accepted."
		});
	}
	if (!(await teacherPasswordVerified(req, res))) return;

	const { username } = req.body as { username?: unknown };
	if (!isValidStudentUsername(username)) {
		return res.status(400).json({
			message: "Username must be 3 to 24 lowercase letters, numbers, or hyphens and start with a letter."
		});
	}

	const normalizedUsername = normalizeStudentUsername(username);
	const accessCode = generateStudentAccessCode();
	const accessCodeHash = await hashStudentCredential(
		normalizeStudentAccessCode(accessCode)
	);
	try {
		const student = await Student.create({
			username: normalizedUsername,
			accessCodeHash,
			accessCodeExpiresAt: studentAccessCodeExpiry(),
			active: true,
			sessionVersion: 0
		});
		return res.status(201).json({
			student: serializeManagedStudent(student),
			accessCode
		});
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			return res.status(409).json({ message: "Username is already in use." });
		}
		return res.status(500).json({ message: "Student account could not be created." });
	}
};

export const setStudentActive: RequestHandler = async (req, res) => {
	const studentID = studentIdParam(req, res);
	if (!studentID) return;

	const keys = Object.keys(req.body ?? {});
	const { active } = req.body as { active?: unknown };
	if (keys.length !== 1 || typeof active !== "boolean") {
		return res.status(400).json({ message: "Only active status can be changed." });
	}

	const existingStudent = await Student.findById(studentID)
		.select(
			"+passwordHash +accessCodeHash"
			+ " +externalAuthProvider +externalAuthSubjectHash"
		);
	if (!existingStudent) return res.sendStatus(404);
	const hasCurrentAccessCode = existingStudent.accessCodeHash
		&& existingStudent.accessCodeExpiresAt
		&& existingStudent.accessCodeExpiresAt.getTime() > Date.now();
	const hasSocialSignIn = Boolean(
		existingStudent.externalAuthProvider
		&& existingStudent.externalAuthSubjectHash
	);
	if (
		active
		&& !existingStudent.passwordHash
		&& !hasCurrentAccessCode
		&& !hasSocialSignIn
	) {
		return res.status(409).json({
			message: "Reset this student's access code before reactivating the account."
		});
	}

	const update: Record<string, unknown> = {
		$inc: { sessionVersion: 1 },
		$set: {
			active,
			failedLoginAttempts: 0
		},
		$unset: {
			lockedUntil: 1,
			...(active
				? {}
				: {
						accessCodeHash: 1,
						accessCodeExpiresAt: 1,
						lastPasswordSetupRequestID: 1,
						pendingSetupCodeHash: 1
					})
		}
	};
	const student = await Student.findByIdAndUpdate(
		studentID,
		update,
		{ new: true }
	).select(
		"+passwordHash +accessCodeHash"
		+ " +externalAuthProvider +externalAuthSubjectHash"
	);
	if (!student) return res.sendStatus(404);
	return res.json({ student: serializeManagedStudent(student) });
};

export const resetStudentAccessCode: RequestHandler = async (req, res) => {
	if (!bodyHasOnlyKeys(req.body, ["teacherPassword"])) {
		return res.status(400).json({
			message: "Only teacher password is accepted."
		});
	}
	if (!(await teacherPasswordVerified(req, res))) return;

	const studentID = studentIdParam(req, res);
	if (!studentID) return;
	if (!(await Student.exists({ _id: studentID }))) {
		return res.sendStatus(404);
	}

	const accessCode = generateStudentAccessCode();
	const accessCodeHash = await hashStudentCredential(
		normalizeStudentAccessCode(accessCode)
	);
	const student = await Student.findByIdAndUpdate(
		studentID,
		{
			$inc: { sessionVersion: 1 },
			$set: {
				accessCodeHash,
				accessCodeExpiresAt: studentAccessCodeExpiry(),
				active: true,
				failedLoginAttempts: 0
			},
			$unset: {
				lockedUntil: 1,
				lastPasswordSetupRequestID: 1,
				externalAuthProvider: 1,
				externalAuthSubjectHash: 1,
				passwordHash: 1,
				passwordSetAt: 1,
				pendingSetupCodeHash: 1
			}
		},
		{ new: true }
	).select(
		"+passwordHash +accessCodeHash"
		+ " +externalAuthProvider +externalAuthSubjectHash"
	);
	if (!student) return res.sendStatus(404);
	return res.json({
		student: serializeManagedStudent(student),
		accessCode
	});
};
