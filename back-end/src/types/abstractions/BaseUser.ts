// src/types/abstractions/BaseUser.ts
import type { Types } from "mongoose";

export interface IBaseUser {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	saveEdit: string; // the “Save” / “Edit” toggle text

	comparePassword: (password: string) => Promise<boolean>;
}
