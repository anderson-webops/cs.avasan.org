import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import {
	closePondPaddlersRoom,
	createPondPaddlersRoom,
	listPondPaddlersRooms
} from "@/modules/pondPaddlersAdmin";

vi.mock("@/api", () => ({
	api: {
		delete: vi.fn(),
		get: vi.fn(),
		post: vi.fn()
	}
}));

const room = {
	calmMode: true,
	createdAt: "2026-08-01T12:00:00.000Z",
	durationMinutes: 60,
	expiresAt: "2026-08-01T13:00:00.000Z",
	finishAt: 10,
	maxOperand: 20,
	operations: ["add"],
	playerCount: 0,
	roomCode: "ABCD2345",
	status: "waiting"
};

describe("Pond Paddlers Admin API", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("lists only Julio's active rooms", async () => {
		vi.mocked(api.get).mockResolvedValueOnce({ data: { rooms: [room] } });

		await expect(listPondPaddlersRooms()).resolves.toEqual([room]);
		expect(api.get).toHaveBeenCalledWith("/pond-paddlers/rooms");
	});

	it("creates a room with the explicit classroom settings", async () => {
		vi.mocked(api.post).mockResolvedValueOnce({ data: { room } });
		const settings = {
			calmMode: true,
			durationMinutes: 60,
			finishAt: 10,
			maxOperand: 20,
			operations: ["add", "subtract"] as const
		};

		await expect(
			createPondPaddlersRoom({
				...settings,
				operations: [...settings.operations]
			})
		).resolves.toEqual(room);
		expect(api.post).toHaveBeenCalledWith("/pond-paddlers/rooms", {
			...settings,
			operations: ["add", "subtract"]
		});
	});

	it("encodes the room code when Julio closes it", async () => {
		vi.mocked(api.delete).mockResolvedValueOnce({ data: undefined });

		await closePondPaddlersRoom("ABCD/2345");

		expect(api.delete).toHaveBeenCalledWith(
			"/pond-paddlers/rooms/ABCD%2F2345"
		);
	});
});
