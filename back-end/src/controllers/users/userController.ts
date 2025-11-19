// src/controllers/users/userController.ts
import { User } from "../../models/schemas/User.js";
import { makeEntityController } from "../common/entityController.js";

export const {
	create: createUser,
	getAll: getAllUsers,
	update: updateUser,
	remove: deleteUser,
	getLoggedIn: getLoggedInUser
} = makeEntityController({
	model: User,
	idParam: "userID",
	sessionKey: "userID",
	responseKey: "currentUser",
	populate: { path: "tutors", select: "name email state" }
});
