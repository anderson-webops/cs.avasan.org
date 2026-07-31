import { describe, expect, it } from "vitest";
import {
	estimatedGraphSnapshotBytes,
	evenlySampleIndexes,
	evenlySampleSeriesIndexes,
	graphHistorySnapshotFits,
	graphPngDimensions,
	GRAPH_SKETCHER_SESSION_STORAGE_KEY,
	MAX_GRAPH_HISTORY_ENTRIES,
	MAX_GRAPH_HISTORY_ESTIMATED_BYTES,
	MAX_GRAPH_PNG_PIXELS,
	MAX_INTERACTIVE_GRAPH_POINTS,
	pushBoundedGraphHistorySnapshot
} from "@/modules/graphSketcherSafety";

describe("Graph Sketcher browser safety limits", () => {
	it("uses a downstream-specific tab storage key", () => {
		expect(GRAPH_SKETCHER_SESSION_STORAGE_KEY).toBe(
			"cs-avasan-graph-sketcher-session-v1"
		);
	});

	it("samples point handles evenly across series within one global cap", () => {
		const sampled = evenlySampleSeriesIndexes([12_000, 8_000, 3], 5_000);
		const sampledCount = sampled.reduce(
			(total, indexes) => total + indexes.length,
			0
		);

		expect(sampledCount).toBe(MAX_INTERACTIVE_GRAPH_POINTS);
		expect(sampled[0][0]).toBe(0);
		expect(sampled[0].at(-1)).toBe(11_999);
		expect(sampled[1][0]).toBe(0);
		expect(sampled[1].at(-1)).toBe(7_999);
		expect(sampled[2]).toEqual([0, 1, 2]);
		expect(evenlySampleIndexes(10, 3)).toEqual([0, 5, 9]);
	});

	it("bounds history by entry count and estimated retained memory", () => {
		const undo: string[] = [];
		const redo: string[] = [];
		for (let index = 0; index < MAX_GRAPH_HISTORY_ENTRIES + 5; index++) {
			pushBoundedGraphHistorySnapshot(
				undo,
				redo,
				`${index}-${"x".repeat(1_000)}`
			);
		}
		expect(undo).toHaveLength(MAX_GRAPH_HISTORY_ENTRIES);

		const largeSnapshot = "x".repeat(4 * 1024 * 1024);
		pushBoundedGraphHistorySnapshot(redo, undo, largeSnapshot);
		pushBoundedGraphHistorySnapshot(
			redo,
			undo,
			`${largeSnapshot}second`
		);
		pushBoundedGraphHistorySnapshot(
			redo,
			undo,
			`${largeSnapshot}third`
		);

		const retainedBytes = [...undo, ...redo].reduce(
			(total, snapshot) =>
				total + estimatedGraphSnapshotBytes(snapshot),
			0
		);
		expect(retainedBytes).toBeLessThanOrEqual(
			MAX_GRAPH_HISTORY_ESTIMATED_BYTES
		);
		const oversizedSnapshot = "x".repeat(
			MAX_GRAPH_HISTORY_ESTIMATED_BYTES
		);
		expect(graphHistorySnapshotFits(oversizedSnapshot)).toBe(false);
		expect(
			pushBoundedGraphHistorySnapshot(
				undo,
				redo,
				oversizedSnapshot
			)
		).toBe(false);
		expect(undo).toEqual([]);
		expect(redo).toEqual([]);
	});

	it("reduces PNG scale to keep the canvas within the pixel budget", () => {
		const normal = graphPngDimensions(900, 600);
		expect(normal).toMatchObject({
			height: 1_200,
			scale: 2,
			width: 1_800
		});

		const large = graphPngDimensions(8_192, 8_192);
		expect(large.width * large.height).toBeLessThanOrEqual(
			MAX_GRAPH_PNG_PIXELS
		);
		expect(large.scale).toBeLessThan(1);
	});
});
