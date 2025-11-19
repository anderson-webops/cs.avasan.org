// src/types/entities/ITutor.ts
import type { IBaseUser } from "../abstractions/BaseUser.js";

export interface ITutor extends IBaseUser {
	age: string;
	state: string;
	usersOfTutorLength?: number;
	coursePermissions: string[];
	editTutors?: boolean;
	role: string; // e.g. "tutor"
}
