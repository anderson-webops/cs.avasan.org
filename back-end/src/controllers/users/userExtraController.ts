// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import { Types } from "mongoose";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";

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
