import type { Types } from "mongoose";

export type PythonProjectMode = "data" | "pgzero" | "python" | "turtle";
export type PythonProjectFileEncoding = "text" | "base64";

export interface PythonProjectFile {
	name: string;
	content: string;
	encoding?: PythonProjectFileEncoding;
}

export interface IPythonProject {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	title: string;
	mode: PythonProjectMode;
	files: PythonProjectFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	importID: string;
	byteCount: number;
	deletedAt?: Date;
	purgeAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
