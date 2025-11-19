// src/types/entities/IUser.ts
import type { Types } from "mongoose";
import type { IBaseUser } from "../abstractions/BaseUser.js";

export interface IUser extends IBaseUser {
	age: string;
	state: string;
	tutors: Types.ObjectId[];
	courseAccess: string[];
	editUsers: boolean;
	role: string; // e.g. "user"
}
