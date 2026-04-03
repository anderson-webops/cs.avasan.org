// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { InternalEmail } from "../../models/schemas/InternalEmail.js";
import { SessionNote } from "../../models/schemas/SessionNote.js";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

function getUserIDParam(req: { params: { userID?: string | string[] } }, res: any): string | null {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		res.status(400).json({ message: "Invalid user ID" });
		return null;
	}
	if (!Types.ObjectId.isValid(userID)) {
		res.status(400).json({ message: "Invalid user ID" });
		return null;
	}
	return userID;
}

function normalizeRecipientName(value: string): string {
	return value.trim().toLowerCase();
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const paramTutorID = req.params.tutorID;
	const tutorID = Array.isArray(paramTutorID) ? paramTutorID[0] : paramTutorID;
	if (typeof tutorID !== "string") {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });
	const users = await User.find({ tutors: new Types.ObjectId(tutorID) });
	res.json(users);
};

export const setUserTutors: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	const { tutorIDs } = req.body as { tutorIDs?: string[] };
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	if (!Array.isArray(tutorIDs)) return res.status(400).json({ message: "tutorIDs must be an array" });

	const cleanTutorIDs = [...new Set(tutorIDs)]
		.filter(id => Types.ObjectId.isValid(id))
		.map(id => new Types.ObjectId(id));

	const validTutors = await Tutor.find({ _id: { $in: cleanTutorIDs } }, { _id: 1 });
	const validTutorIds = validTutors.map(t => t._id);
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	user.tutors = validTutorIds;
	await user.save();
	res.json({ tutors: user.tutors });
};

export const setUserRecipientAssociation: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	if (!req.currentAdmin) {
		return res.status(403).json({ message: "Admin session required" });
	}

	const rawRecipientName = req.body?.recipientName;
	const recipientName
		= typeof rawRecipientName === "string" ? rawRecipientName.trim() : "";
	const recipientNameKey = recipientName
		? normalizeRecipientName(recipientName)
		: undefined;

	if (recipientNameKey) {
		const existingUser = await User.findOne(
			{
				recipientNameKey,
				_id: { $ne: userID }
			},
			{ _id: 1, name: 1 }
		).lean();

		if (existingUser) {
			return res.status(409).json({
				message: `Recipient name is already associated with ${existingUser.name}.`
			});
		}
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	user.recipientName = recipientName || undefined;
	user.recipientNameKey = recipientNameKey;
	await user.save();

	res.json({ recipientName: user.recipientName ?? null });
};

export const setUserCourseAccess: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	const { courseIDs } = req.body as { courseIDs?: string[] };
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	if (!Array.isArray(courseIDs)) return res.status(400).json({ message: "courseIDs must be an array" });

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);

	const uniqueCourses = [...new Set(courseIDs.map(id => id?.trim()).filter(Boolean))] as string[];

	const actingTutor = req.currentTutor;
	const actingAdmin = req.currentAdmin;

	if (!actingAdmin) {
		if (!actingTutor) {
			return res.status(403).json({ message: "Tutor session required" });
		}

		const tutorOwnsUser = user.tutors.some(t => t.toString() === actingTutor._id.toString());
		if (!tutorOwnsUser) {
			return res
				.status(403)
				.json({ message: "You can only assign courses for your own students" });
		}

		const allowed = new Set(actingTutor.coursePermissions ?? []);
		const invalidCourse = uniqueCourses.find(course => !allowed.has(course));
		if (invalidCourse) {
			return res.status(403).json({ message: `Course ${invalidCourse} is not enabled for this tutor` });
		}
	}

	user.courseAccess = uniqueCourses;
	await user.save();
	res.json({ courseAccess: user.courseAccess });
};

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	if (await Tutor.exists({ email: user.email })) {
		return res.status(409).json({ message: "Tutor with this email already exists" });
	}

	const tutor = new Tutor({
		name: user.name,
		email: user.email,
		age: user.age,
		state: user.state,
		password: user.password,
		role: "tutor"
	} as any);
	(tutor as any).skipPasswordHash = true;

	await tutor.save();
	await user.deleteOne();

	res.status(201).json({ tutor });
};

export const deleteOwnUser: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	const actingUser = req.currentUser;
	if (!actingUser) {
		return res.status(403).json({ message: "User session required" });
	}

	if (actingUser._id.toString() !== userID) {
		return res.status(403).json({ message: "You can only delete your own account" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	await user.deleteOne();
	res.sendStatus(200);
};

export const deleteUserAsTutor: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	const actingTutor = req.currentTutor;
	if (!actingTutor) {
		return res.status(403).json({ message: "Tutor session required" });
	}

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);

	const tutorOwnsUser = user.tutors.some(t => t.toString() === actingTutor._id.toString());
	if (!tutorOwnsUser) {
		return res.status(403).json({ message: "You can only delete your own students" });
	}

	await user.deleteOne();
	res.sendStatus(200);
};

export const deleteUserAsAdmin: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	if (!req.currentAdmin) {
		return res.status(403).json({ message: "Admin session required" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	await user.deleteOne();
	res.sendStatus(200);
};

export const getLoggedInUserCommunications: RequestHandler = async (req, res) => {
	const actingUser = req.currentUser;
	if (!actingUser) {
		return res.status(403).json({ message: "User session required" });
	}

	const normalizedEmail = actingUser.email.trim().toLowerCase();
	const [sessionNotes, internalEmails] = await Promise.all([
		SessionNote.find({
			$or: [
				{ user: actingUser._id },
				{
					user: { $exists: false },
					primaryEmail: normalizedEmail
				}
			]
		})
			.sort({ sessionDate: -1, createdAt: -1 })
			.limit(3)
			.lean(),
		InternalEmail.find({ user: actingUser._id })
			.sort({ sentAt: -1, createdAt: -1 })
			.limit(12)
			.lean()
	]);

	return res.json({
		sessionNotes: sessionNotes.map(note => ({
			_id: String(note._id),
			studentName: note.studentName,
			primaryEmail: note.primaryEmail,
			ccEmails: note.ccEmails ?? [],
			subject: note.subject,
			sessionDate: note.sessionDate,
			markdown: note.markdown,
			createdAt: note.createdAt,
			updatedAt: note.updatedAt
		})),
		internalEmails: internalEmails.map(email => ({
			_id: String(email._id),
			matchedRecipientEmail: email.matchedRecipientEmail,
			primaryEmail: email.primaryEmail,
			ccEmails: email.ccEmails ?? [],
			fromAddress: email.fromAddress,
			subject: email.subject,
			markdown: email.markdown,
			messageId: email.messageId ?? null,
			transportUsed: email.transportUsed,
			sentAt: email.sentAt,
			createdAt: email.createdAt,
			updatedAt: email.updatedAt
		}))
	});
};
