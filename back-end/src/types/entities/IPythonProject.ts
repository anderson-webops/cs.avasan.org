import type { Types } from "mongoose";

export type PythonProjectMode = "pgzero" | "python" | "turtle";

export interface PythonProjectFile {
	name: string;
	content: string;
}

export interface IPythonProject {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	title: string;
	mode: PythonProjectMode;
	files: PythonProjectFile[];
	activeFileName: string;
	createdAt: Date;
	updatedAt: Date;
}
