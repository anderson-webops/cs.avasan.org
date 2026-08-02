import { api } from "@/api";

export const POND_PADDLERS_OPERATIONS = [
	"add",
	"subtract",
	"multiply",
	"divide"
] as const;

export type PondPaddlersOperation = (typeof POND_PADDLERS_OPERATIONS)[number];

export interface PondPaddlersAdminRoom {
	calmMode: boolean;
	createdAt: string;
	durationMinutes: number;
	expiresAt: string;
	finishAt: number;
	maxOperand: number;
	operations: PondPaddlersOperation[];
	playerCount: number;
	roomCode: string;
	status: "waiting" | "racing" | "finished";
}

export interface CreatePondPaddlersRoomInput {
	calmMode: boolean;
	durationMinutes: number;
	finishAt: number;
	maxOperand: number;
	operations: PondPaddlersOperation[];
}

export async function listPondPaddlersRooms() {
	const { data } = await api.get<{ rooms: PondPaddlersAdminRoom[] }>(
		"/pond-paddlers/rooms"
	);
	return data.rooms;
}

export async function createPondPaddlersRoom(
	input: CreatePondPaddlersRoomInput
) {
	const { data } = await api.post<{ room: PondPaddlersAdminRoom }>(
		"/pond-paddlers/rooms",
		input
	);
	return data.room;
}

export async function closePondPaddlersRoom(roomCode: string) {
	await api.delete(`/pond-paddlers/rooms/${encodeURIComponent(roomCode)}`);
}
